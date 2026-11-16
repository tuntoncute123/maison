import type { Product } from './types';
import { categories } from './types';
export function validateProduct(input: Record<string, unknown>): Product {
  const {
    name,
    category,
    gender,
    price,
    originalPrice,
    image,
    description,
    colors,
    sizes,
    stock,
    badge,
    featured,
  } = input;
  if (typeof name !== 'string' || name.trim().length < 3 || name.length > 120)
    throw new Error('Tên sản phẩm cần từ 3 đến 120 ký tự.');
  if (
    !categories.includes(String(category)) ||
    !['men', 'women', 'unisex'].includes(String(gender))
  )
    throw new Error('Danh mục không hợp lệ.');
  if (
    !Number.isSafeInteger(price) ||
    Number(price) < 1000 ||
    Number(price) > 100000000 ||
    !Number.isSafeInteger(stock) ||
    Number(stock) < 0 ||
    Number(stock) > 1000000
  )
    throw new Error('Giá hoặc tồn kho không hợp lệ.');
  if (
    !Number.isSafeInteger(originalPrice) ||
    Number(originalPrice) < 0 ||
    (Number(originalPrice) > 0 && Number(originalPrice) < Number(price))
  )
    throw new Error('Giá gốc phải bằng 0 hoặc lớn hơn giá bán.');
  if (
    typeof image !== 'string' ||
    image.length > 2048 ||
    (!/^\/images\/[\w.-]+$/.test(image) && !/^https:\/\//.test(image))
  )
    throw new Error('Ảnh cần là đường dẫn /images/ hoặc URL HTTPS.');
  if (typeof description !== 'string' || description.length > 5000)
    throw new Error('Mô tả tối đa 5.000 ký tự.');
  if (
    !Array.isArray(colors) ||
    !colors.length ||
    colors.length > 10 ||
    colors.some((c) => typeof c !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(c))
  )
    throw new Error('Màu sắc phải có mã HEX gồm 6 ký tự.');
  if (
    !Array.isArray(sizes) ||
    !sizes.length ||
    sizes.length > 10 ||
    sizes.some((s) => typeof s !== 'string' || s.length > 20 || !s.trim())
  )
    throw new Error('Cần ít nhất một kích cỡ hợp lệ.');
  return {
    id: '',
    name: name.trim(),
    category: String(category),
    gender: gender as Product['gender'],
    price: Number(price),
    originalPrice: Number(originalPrice),
    image,
    description,
    colors,
    sizes: [...new Set(sizes)],
    stock: Number(stock),
    badge: String(badge || '').slice(0, 30),
    featured: !!featured,
  };
}
export function message(error: unknown) {
  return error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
}
