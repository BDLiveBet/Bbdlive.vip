export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or iframes without clipboard-write permission
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Prevent scrolling to bottom
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      return new Promise((res, rej) => {
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          res(successful);
        } catch (err) {
          document.body.removeChild(textArea);
          res(false);
        }
      });
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
