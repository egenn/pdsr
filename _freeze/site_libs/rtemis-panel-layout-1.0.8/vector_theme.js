// Theme and XML text utilities shared by vector backends. No DOM dependency.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RtemisVectorTheme = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  function isDark(color) {
    let hex = String(color || '').replace('#', '');
    if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
    return (0.299 * parseInt(hex.slice(0,2),16) + 0.587 * parseInt(hex.slice(2,4),16) + 0.114 * parseInt(hex.slice(4,6),16)) < 127.5;
  }
  function escape(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  }
  function resolve(theme) {
    const bg = theme?.backgroundColor || '#ffffff';
    return {bg, dark:isDark(bg), fg:theme?.textStyle?.color || '#1a1a1a', fontFamily:theme?.textStyle?.fontFamily || 'sans-serif'};
  }
  return {isDark, escape, resolve};
});
