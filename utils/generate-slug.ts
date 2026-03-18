const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spasi jadi -
    .replace(/[^\w-]+/g, "") // hapus karakter aneh
    .replace(/--+/g, "-"); // double dash jadi satu
};

export default generateSlug;
