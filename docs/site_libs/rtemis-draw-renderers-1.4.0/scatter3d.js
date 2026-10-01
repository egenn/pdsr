// Orthographic projection matching ECharts-GL 2.1 Cartesian3D/OrbitControl.
// The browser uses GL; Node writes vector marks without a browser or raster.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.rtemisScatter3D = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const esc = value => String(value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const fallback = ['#6ca3a0','#ef8a00','#bf1f59','#4078a6','#80558c'];
  let svgSequence = 0;
  const extent = (grid,width) => grid.rtemisViewSize * (width < 500 ? 2.2 : 1);
  function prepare(option, theme, width, height) {
    if (!option.grid3D) return;
    const grid = option.grid3D;
    // Match the same viewing volume at wide/narrow sizes. GL adds one to the
    // authored orthographicSize, per OrbitControl's baseOrthoSize default.
    const left = 12;
    const w = Math.max(1, width - left - 12), h = Math.max(1, height - 80);
    grid.left = left; grid.width = w; grid.height = h;
    grid.viewControl.orthographicSize = extent(grid,width) * Math.max(1, h / w) - 1;
    const color = theme?.textStyle?.color || '#333333';
    const captions=[];
    for (const [i,key] of ['xAxis3D','yAxis3D','zAxis3D'].entries()) {
      const axis=option[key], dimension=['x','y','z'][i];
      axis.rtemisAxisName=axis.rtemisAxisName || axis.name;
      axis.name=width<500?dimension:axis.rtemisAxisName;
      captions.push({id:'rtemis3d-'+dimension+'-name',type:'text',left:12,bottom:46-i*16,
        silent:true,invisible:width>=500,style:{text:dimension+': '+axis.rtemisAxisName,
          fill:color,font:'11px '+(theme?.textStyle?.fontFamily || 'sans-serif')}});
      option[key].axisLabel.color = color;
      option[key].axisLabel.formatter = v => Number(Number(v).toPrecision(4));
      option[key].axisLabel.fontSize = 11;
      option[key].axisLabel.fontFamily = theme?.textStyle?.fontFamily || "sans-serif";
      option[key].nameTextStyle.fontFamily = theme?.textStyle?.fontFamily || "sans-serif";
      option[key].nameTextStyle.fontSize = width < 500 ? 11 : 12;
      option[key].nameGap = width < 500 ? (key==='zAxis3D'?50:35) : 25;
      option[key].interval=(option[key].max-option[key].min)/(width<500?2:4);
      option[key].nameTextStyle.color = color;
    }
    const graphics=option.graphic ? (Array.isArray(option.graphic)?option.graphic:[option.graphic]) : [];
    option.graphic=graphics.filter(g=>!String(g.id||'').startsWith('rtemis3d-')).concat(captions);
    // JSON auto-unboxing can turn a one-color palette into a scalar string.
    const palette = option.color || theme?.color || fallback;
    const colors = Array.isArray(palette) ? palette : [palette];
    const names=[...new Set(option.series.map(s=>s.name))];
    option.series.forEach(s => {
      const key=s.type==='line3D'?'lineStyle':'itemStyle';
      s[key]=s[key] || {};
      s[key].color=s[key].color || colors[names.indexOf(s.name) % colors.length];
    });
  }
  function geometry(option, width, height) {
    const grid = option.grid3D, vc = grid.viewControl;
    if(option.series.some(s=>!['scatter3D','line3D','surface'].includes(s.type)))
      throw new Error('3D SVG supports scatter3D, line3D and materialized surface grids.');
    if (vc.projection !== 'orthographic') throw new Error('3D SVG requires the supported orthographic camera.');
    const left = 12;
    const w = Math.max(1, width - left - 12), h = Math.max(1, height - 80);
    const scale = Math.min(w,h) / extent(grid,width);
    const a = vc.alpha * Math.PI / 180, b = vc.beta * Math.PI / 180;
    const sa = Math.sin(a), ca = Math.cos(a), sb = Math.sin(b), cb = Math.cos(b);
    const axes = [option.xAxis3D, option.yAxis3D, option.zAxis3D];
    // Cartesian3D maps data y to reversed world z, and data z to world y.
    const projectWorld = p => {
      const X = p[0], Y = p[1], Z = p[2];
      return [left+w/2 + scale*(cb*X-sb*Z),
        60+h/2 - scale*(-sa*sb*X+ca*Y-sa*cb*Z),
        ca*sb*X+sa*Y+ca*cb*Z];
    };
    const project = values => {
      const scaled = values.map((v,i) => 100*((v-axes[i].min)/(axes[i].max-axes[i].min)-.5));
      return projectWorld([scaled[0],scaled[2],-scaled[1]]);
    };
    const points = [], lines = [], triangles = [], primitives = [];
    const valid=p=>Array.isArray(p)&&p.length>=3&&p.slice(0,3).every(Number.isFinite);
    option.series.forEach((s,si) => {
      if (option.legend?.selected?.[s.name] === false) return;
      const style=(s.type==='line3D'?s.lineStyle:s.itemStyle) || {};
      const base={series:si,color:style.color,opacity:style.opacity ?? 1};
      if(s.type==='scatter3D') {
        s.data.forEach((p,i)=>{
          if(!valid(p))return;
          const point=project(p.slice(0,3)),size=s.symbolSize ?? 8;
          const mark={...base,point,value:p,series:si,index:i,size,kind:'point'};
          points.push(mark);
          // A GL point sprite is a camera-facing disk of constant depth. Use
          // its bounding square for splitting; SVG clips the original circle.
          const [x,y,z]=point,r=size/2;
          primitives.push({...mark,vertices:[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]]});
        });
      } else if(s.type==='line3D') {
        const projected=s.data.map(p=>valid(p)?project(p):null);
        for(const segment of pathGeometry(projected,s.lineStyle?.width ?? 2)) {
          const mark={...base,kind:'line',...segment};
          lines.push(mark);
          // Match Lines3D's two triangles, including depth interpolation across
          // miter joins; a nonparallel four-corner strip need not be planar.
          for(const indices of [[0,1,2],[1,3,2]])
            primitives.push({...mark,vertices:indices.map(i=>segment.vertices[i])});
        }
      } else {
        if(s.shading!=='color'||s.wireframe?.show!==false)
          throw new Error('Surface SVG requires flat color shading with wireframe disabled.');
        const [rows,cols]=s.dataShape || [];
        if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<2||cols<2||rows*cols!==s.data.length)
          throw new Error('Supply a materialized surface grid with a matching dataShape.');
        for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++) {
          const a=r*cols+c,b=a+1,d=(r+1)*cols+c,e=d+1;
          if(![a,b,d,e].every(i=>valid(s.data[i])))continue;
          // Exact SurfaceView getQuadIndices/quadToTriangle topology, including
          // the diagonal on nonplanar cells. No alternate triangulation here.
          for(const indices of [[b,e,a],[a,e,d]]) {
            const mark={...base,kind:'surface',index:triangles.length,
              values:indices.map(i=>s.data[i]),vertices:indices.map(i=>project(s.data[i]))};
            triangles.push(mark);primitives.push(mark);
          }
        }
      }
    });
    points.sort((a,b)=>a.point[2]-b.point[2]);
    return {project,projectWorld,points,lines,triangles,primitives,axes};
  }

  // Port of the orthographic screen-space expansion in lines3D.glsl. The
  // y-down SVG normal reverses the shader's y-up normal, and its miter limit is 2.
  function pathGeometry(points,width) {
    const unit=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return n>1e-10?[dx/n,dy/n]:null;};
    const offsets=points.map((p,i)=>{
      if(!p)return null;
      const a=i>0&&points[i-1]?unit(points[i-1],p):null;
      const b=i<points.length-1&&points[i+1]?unit(p,points[i+1]):null;
      if(!a&&!b)return [0,0];
      let dir=a || b, length=width/2;
      if(a&&b) {
        const tangent=unit([0,0],[a[0]+b[0],a[1]+b[1]]);
        // Exactly reversed segments have no defined miter; use a butt join.
        if(tangent) {dir=tangent;length/=Math.max(dir[0]*a[0]+dir[1]*a[1],.5);}
      }
      return [dir[1]*length,-dir[0]*length];
    });
    const result=[];
    for(let i=1;i<points.length;i++) {
      const a=points[i-1],b=points[i];
      if(!a||!b||!unit(a,b))continue;
      const u=offsets[i-1],v=offsets[i];
      result.push({index:i-1,a,b,vertices:[
        [a[0]+u[0],a[1]+u[1],a[2]],[a[0]-u[0],a[1]-u[1],a[2]],
        [b[0]+v[0],b[1]+v[1],b[2]],[b[0]-v[0],b[1]-v[1],b[2]]
      ]});
    }
    return result;
  }

  // Binary space partitioning provides a back-to-front vector painter order.
  // Sorting whole triangles by centroid is incorrect at surface intersections
  // and when a path or point sprite crosses a surface. Split their planar
  // geometry instead. Surface colors are constant, so splitting preserves it.
  function orderPrimitives(primitives) {
    const eps=1e-7, limit=80000;
    let fragments=primitives.length;
    if(fragments>limit)throw new Error('Too much 3D geometry for SVG; use fewer points or a coarser surface grid.');
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const plane=vertices=>{
      const a=vertices[0];
      for(let i=1;i<vertices.length-1;i++) {
        const u=vertices[i].map((v,j)=>v-a[j]),v=vertices[i+1].map((v,j)=>v-a[j]);
        const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
        const length=Math.hypot(...n);
        if(length>eps) {const normal=n.map(x=>x/length);return {normal,d:dot(normal,a)};}
      }
      return null;
    };
    const partition=(item,p)=>{
      const distance=item.vertices.map(v=>dot(p.normal,v)-p.d);
      const front=distance.some(d=>d>eps),back=distance.some(d=>d < -eps);
      if(!front&&!back)return {same:item};
      if(!back)return {front:item};
      if(!front)return {back:item};
      const f=[],b=[],vertices=item.vertices;
      for(let i=0;i<vertices.length;i++) {
        const next=(i+1)%vertices.length,a=vertices[i],z=vertices[next],d=distance[i],e=distance[next];
        if(d>=-eps)f.push(a);
        if(d<=eps)b.push(a);
        if((d>eps&&e < -eps)||(d < -eps&&e>eps)) {
          const t=d/(d-e),intersection=a.map((v,j)=>v+t*(z[j]-v));
          f.push(intersection);b.push(intersection);
        }
      }
      if(++fragments>limit)throw new Error('Surface intersections exceed the SVG geometry budget; use a coarser grid or fewer layers.');
      return {front:{...item,vertices:f},back:{...item,vertices:b}};
    };
    // Iterative traversal avoids call-stack dependence for long paths/grids.
    const stack=[{items:primitives}],ordered=[];
    while(stack.length) {
      const task=stack.pop();
      if(task.emit) {for(const item of task.emit)ordered.push(item);continue;}
      const items=task.items.filter(x=>plane(x.vertices));
      if(!items.length)continue;
      if(items.length===1) {ordered.push(items[0]);continue;}
      const pivot=items[Math.floor(items.length/2)],p=plane(pivot.vertices);
      const front=[],back=[],same=[];
      for(const item of items) {
        const parts=partition(item,p);
        if(parts.front)front.push(parts.front);
        if(parts.back)back.push(parts.back);
        if(parts.same)same.push(parts.same);
      }
      same.sort((a,b)=>({surface:0,line:1,point:2}[a.kind]-{surface:0,line:1,point:2}[b.kind]));
      // Orthographic eye is at positive camera depth. Stack is last-in first-out.
      const near=p.normal[2]>=0?front:back,far=p.normal[2]>=0?back:front;
      if(near.length)stack.push({items:near});
      stack.push({emit:same});
      if(far.length)stack.push({items:far});
    }
    return ordered;
  }
  function svg(payload, width, height) {
    const option = payload.option, theme = payload.theme || {};
    prepare(option, theme, width, height);
    const g = geometry(option,width,height);
    const bg = option.backgroundColor || theme.backgroundColor || '#ffffff';
    const fg = theme.textStyle?.color || '#333333';
    const family = theme.textStyle?.fontFamily || 'sans-serif';
    const f = n => {if (!Number.isFinite(n)) throw new Error('Non-finite 3D SVG coordinate'); return Number(n.toFixed(5));};
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${esc(bg)}"/><g font-family="${esc(family)}" font-size="12" fill="${esc(fg)}">`;
    const path = (a,b,color='#888888') => `<path d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}" fill="none" stroke="${esc(color)}" stroke-opacity=".55"/>`;
    // Full wireframe makes the three data dimensions readable from every view.
    for (let dim=0;dim<3;dim++) for (const u of [-50,50]) for (const v of [-50,50]) {
      const a=[u,v,0], b=[u,v,0]; a.splice(dim,0,-50); b.splice(dim,0,50); a.length=3;b.length=3;
      out += path(g.projectWorld(a),g.projectWorld(b));
    }
    // Label outer projected edges, rather than drawing all three scales from
    // the same corner inside the point cloud. Edge choice follows the camera.
    const center=g.projectWorld([0,0,0]);
    g.axes.forEach((axis,dim) => {
      const other=[0,1,2].filter(d=>d!==dim), candidates=[];
      for (const u of [0,1]) for (const v of [0,1]) {
        const start=g.axes.map(a=>a.min);
        start[other[0]]=g.axes[other[0]][u?'max':'min'];
        start[other[1]]=g.axes[other[1]][v?'max':'min'];
        const end=start.slice();end[dim]=axis.max;
        const a=g.project(start), b=g.project(end);
        const mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];
        const score=dim===2 ? -mid[0] : mid[1];
        candidates.push({start,end,a,b,mid,score});
      }
      candidates.sort((a,b)=>b.score-a.score);
      const edge=candidates[0], dx=edge.b[0]-edge.a[0],dy=edge.b[1]-edge.a[1];
      const length=Math.hypot(dx,dy);
      // A dimension viewed end-on has no readable projected scale.
      if(length<12) return;
      let normal=[-dy/length,dx/length];
      if(normal[0]*(edge.mid[0]-center[0])+normal[1]*(edge.mid[1]-center[1])<0)
        normal=normal.map(v=>-v);
      const anchor=normal[0]<-.5?'end':normal[0]>.5?'start':'middle';
      // Interior ticks avoid duplicate endpoint labels at shared corners.
      for(let k=1;k<4;k++) {
        const value=axis.min+(axis.max-axis.min)*k/4,p=edge.start.slice();p[dim]=value;
        const xy=g.project(p);
        out+=`<text x="${f(xy[0]+normal[0]*9)}" y="${f(xy[1]+normal[1]*9+4)}" text-anchor="${anchor}">${esc(Number(value.toPrecision(4)))}</text>`;
      }
      const name=[edge.mid[0]+normal[0]*48,edge.mid[1]+normal[1]*48];
      // Keep long axis names inside the canvas without placing them over data.
      const nameWidth=dim===2?12:String(axis.rtemisAxisName||axis.name).length*6.5;
      name[0]=Math.max(nameWidth/2+6,Math.min(width-nameWidth/2-6,name[0]));
      out+=`<text x="${f(name[0])}" y="${f(name[1]+4)}" text-anchor="middle" font-weight="600"${dim===2?` transform="rotate(-90 ${f(name[0])} ${f(name[1]+4)})"`:""}>${esc(axis.rtemisAxisName||axis.name)}</text>`;
    });
    const circle=p=>`<circle data-series="${p.series}" data-index="${p.index}" cx="${f(p.point[0])}" cy="${f(p.point[1])}" r="${f(p.size/2)}" fill="${esc(p.color)}" fill-opacity="${p.opacity}"/>`;
    if(!g.lines.length&&!g.triangles.length) {
      for(const p of g.points)out+=circle(p);
    } else {
      const prefix='rt3d-'+(++svgSequence);
      const polygon=vertices=>vertices.map((p,i)=>(i?'L':'M')+f(p[0])+','+f(p[1])).join('')+'Z';
      for(const [i,mark] of orderPrimitives(g.primitives).entries()) {
        const d=polygon(mark.vertices);
        if(mark.kind==='point') {
          const id=prefix+'-clip-'+i;
          out+=`<defs><clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${circle(mark)}</g>`;
        } else {
          out+=`<path data-kind="${mark.kind}" data-series="${mark.series}" data-index="${mark.index}" d="${d}" fill="${esc(mark.color)}" fill-opacity="${mark.opacity}" stroke="none"/>`;
        }
      }
    }
    if (option.title?.text) out += `<text x="12" y="20" font-size="16">${esc(option.title.text)}</text>`;
    if (option.legend && option.legend.show !== false) {
      let x=12,y=option.title?.text?42:20;
      const seen=new Set();
      option.series.forEach(s=>{
        if(seen.has(s.name))return;seen.add(s.name);
        const style=s.type==='line3D'?s.lineStyle:s.itemStyle;
        const len=28+7*String(s.name).length;
        if (x+len>width-12) {x=12;y+=18;}
        out+=`<rect x="${x}" y="${y-9}" width="15" height="10" rx="2" fill="${esc(style.color)}"/><text x="${x+20}" y="${y}">${esc(s.name)}</text>`;
        x+=len;
      });
    }
    return out+'</g></svg>';
  }
  return {prepare,geometry,pathGeometry,orderPrimitives,svg};
});
