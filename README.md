This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Aplikasi Web Artikel

## Deskripsi

**Aplikasi Web Artikel** adalah platform berbasis web yang memungkinkan pengguna membaca, mencari, dan memfilter artikel berdasarkan kategori, serta memungkinkan admin untuk mengelola konten artikel dan kategori.  
Aplikasi ini memiliki dua peran utama: **user** dan **admin**.

---

## Fitur

### Untuk User:

- Autentikasi login & register
- Menampilkan daftar artikel
- Filter artikel berdasarkan kategori dan judul
- Melihat detail artikel

### Untuk Admin:

- Autentikasi login & register (dapat memilih role admin atau user saat register)
- Kelola Artikel:
  - Tambah artikel baru
  - Edit artikel yang ada
  - Hapus artikel
- Kelola Kategori:
  - Tambah kategori baru
  - Edit kategori
  - Hapus kategori

---

## Catatan Routing

- Saat mengakses domain utama (misalnya `https://yourdomain.com`), pengguna akan diarahkan ke halaman list artikel.  
  Jika belum login, akan otomatis redirect ke:
