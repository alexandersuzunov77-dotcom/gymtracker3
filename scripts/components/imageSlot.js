// Reusable drop/click image slot. Resizes+compresses images client-side
// before handing back a dataURL, to keep localStorage usage sane.

function compressImage(file, maxDim = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * @param {object} opts
 * @param {string|null} opts.image - current dataURL, if any
 * @param {string} opts.placeholder - placeholder text
 * @param {string} [opts.placeholderSvg] - inline SVG art shown when no image is set
 * @param {(dataUrl: string|null) => void} opts.onChange
 * @param {boolean} [opts.removable]
 */
export function createImageSlot({ image, placeholder, placeholderSvg, onChange, removable = true }) {
  const el = document.createElement('div');
  el.className = 'image-slot';

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  function paint() {
    el.innerHTML = '';
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      el.appendChild(img);
      if (removable) {
        const rm = document.createElement('button');
        rm.className = 'remove-btn';
        rm.textContent = '✕';
        rm.title = 'Remove photo';
        rm.addEventListener('click', (e) => {
          e.stopPropagation();
          image = null;
          onChange(null);
          paint();
        });
        el.appendChild(rm);
      }
    } else if (placeholderSvg) {
      const art = document.createElement('div');
      art.className = 'art-ph';
      art.innerHTML = placeholderSvg;
      el.appendChild(art);
      const hint = document.createElement('div');
      hint.className = 'art-hint';
      hint.textContent = placeholder || 'Click or drop a photo to replace';
      el.appendChild(hint);
    } else {
      const p = document.createElement('div');
      p.className = 'placeholder-text';
      p.textContent = placeholder || 'Click or drop image';
      el.appendChild(p);
    }
    el.appendChild(input);
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await compressImage(file);
    image = dataUrl;
    onChange(dataUrl);
    paint();
  }

  el.addEventListener('click', () => input.click());
  input.addEventListener('change', () => handleFile(input.files[0]));

  el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drag-over'); });
  el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    el.classList.remove('drag-over');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  });

  paint();
  return el;
}
