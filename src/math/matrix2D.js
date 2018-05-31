export const m2D = {
  identity() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },
  projection(w, h) {
    const x = 2 / w;
    const y = -2 / h;

    return [
      x, 0, 0,
      0, y, 0,
      -1, 1, 1,
    ];
  },
  translation(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },
  rotation(angle) {
    const radians = angle * Math.PI / 100;
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    return [
      c, s, 0,
      -s, c, 0,
      0, 0, 1,
    ];
  },
  scaling(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },
  multiply(a, b) {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];

    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];

    const r00 = b00 * a00 + b01 * a10 + b02 * a20;
    const r01 = b00 * a01 + b01 * a11 + b02 * a21;
    const r02 = b00 * a02 + b01 * a12 + b02 * a22;
    const r10 = b10 * a00 + b11 * a10 + b12 * a20;
    const r11 = b10 * a01 + b11 * a11 + b12 * a21;
    const r12 = b10 * a02 + b11 * a12 + b12 * a22;
    const r20 = b20 * a00 + b21 * a10 + b22 * a20;
    const r21 = b20 * a01 + b21 * a11 + b22 * a21;
    const r22 = b20 * a02 + b21 * a12 + b22 * a22;

    return [
      r00, r01, r02,
      r10, r11, r12,
      r20, r21, r22,
    ];
  },
  translate(m, tx, ty) {
    return this.multiply(m, this.translation(tx, ty));
  },
  rotate(m, angle) {
    return this.multiply(m, this.rotation(angle));
  },
  scale(m, sx, sy) {
    return this.multiply(m, this.scaling(sx, sy));
  },
};
