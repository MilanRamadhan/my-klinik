# ✅ Checklist Deployment

Gunakan checklist ini sebelum deploy ke production.

## 📋 Pre-Deployment

### Environment Variables

- [ ] `.env.local` sudah dibuat dan terisi
- [ ] `NEXT_PUBLIC_SUPABASE_URL` benar
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- [ ] `NEXTAUTH_URL` diubah ke production URL (bukan localhost)
- [ ] `NEXTAUTH_SECRET` adalah random string yang secure
- [ ] File `.env.local` TIDAK di-commit ke git (ada di `.gitignore`)

### Supabase Setup

- [ ] Project Supabase sudah dibuat
- [ ] Email Authentication sudah enabled
- [ ] Confirm email optional (untuk testing) atau required (untuk production)
- [ ] Email templates sudah dikustomisasi (optional)
- [ ] Rate limiting sudah dikonfigurasi
- [ ] RLS (Row Level Security) sudah dikonfigurasi jika menggunakan database

### Code Review

- [ ] Tidak ada console.log yang sensitive
- [ ] Error handling sudah proper
- [ ] Loading states sudah ditambahkan
- [ ] Validation input sudah lengkap
- [ ] No hardcoded credentials

### Testing

- [ ] Register user baru berhasil
- [ ] Login berhasil
- [ ] Logout berhasil
- [ ] Protected pages redirect ke login
- [ ] Session persist setelah refresh
- [ ] Error messages muncul dengan benar
- [ ] UI responsive di mobile & desktop

## 🚀 Deployment Steps

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

**Environment Variables di Vercel:**

1. Buka Vercel Dashboard
2. Project Settings > Environment Variables
3. Tambahkan semua env vars dari `.env.local`
4. Pastikan `NEXTAUTH_URL` adalah production URL

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Environment Variables di Netlify:**

1. Site Settings > Build & Deploy > Environment
2. Tambahkan semua env vars

### 3. Self-Hosted (VPS/Docker)

**Build:**

```bash
npm run build
```

**Run:**

```bash
npm start
```

**Environment Variables:**
Set di server environment atau `.env.production`

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] NEXTAUTH_SECRET is strong (min 32 characters)
- [ ] API keys tidak exposed di client-side
- [ ] CORS configured properly
- [ ] Rate limiting enabled di Supabase
- [ ] No sensitive data in localStorage
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

## 📊 Post-Deployment

### Monitoring

- [ ] Setup error tracking (Sentry, LogRocket)
- [ ] Setup analytics (Google Analytics, Plausible)
- [ ] Monitor Supabase usage
- [ ] Setup uptime monitoring

### Testing Production

- [ ] Register test user
- [ ] Login test
- [ ] All pages accessible
- [ ] Protected pages working
- [ ] Email notifications working (if enabled)
- [ ] Mobile responsiveness
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Images optimized
- [ ] Fonts optimized

## 🔄 Maintenance

### Regular Tasks

- [ ] Monitor Supabase usage (free tier: 50K MAU)
- [ ] Check error logs
- [ ] Update dependencies monthly
- [ ] Backup Supabase data (export users)
- [ ] Review security settings

### Scaling

- [ ] Monitor response times
- [ ] Check Supabase performance
- [ ] Consider upgrading Supabase plan if needed
- [ ] Optimize database queries

## 📝 Documentation

- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedure

## 🆘 Rollback Plan

Jika deployment gagal:

1. **Revert di Vercel/Netlify:**

   - Dashboard > Deployments
   - Pilih deployment sebelumnya
   - Klik "Promote to Production"

2. **Revert di Git:**

   ```bash
   git revert HEAD
   git push
   ```

3. **Check Supabase:**
   - Pastikan tidak ada perubahan di schema
   - Restore dari backup jika perlu

## 🎯 Success Criteria

Deployment dianggap sukses jika:

- ✅ Website dapat diakses via production URL
- ✅ Register & login berfungsi
- ✅ Session persists across pages
- ✅ Protected pages berfungsi
- ✅ Logout berfungsi
- ✅ No errors di console
- ✅ Performance score bagus
- ✅ Mobile responsive

## 📞 Support

Jika ada masalah setelah deployment:

1. Check Vercel/Netlify logs
2. Check browser console
3. Check Supabase logs
4. Review environment variables
5. Test locally dengan production env vars

---

**Good Luck! 🚀**

Last Updated: 27 Oktober 2025
