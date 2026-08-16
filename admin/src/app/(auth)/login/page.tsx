import Link from 'next/link'

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Sign in to your account</h2>
      <p className="text-center text-sm text-slate-600 mb-6">
        Enter your credentials to access the admin panel
      </p>
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="admin-input"
              placeholder="admin@homepulse.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="admin-input"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
              Forgot your password?
            </Link>
          </div>
        </div>

        <button type="submit" className="w-full admin-btn-primary">
          Sign in
        </button>
      </form>
    </div>
  )
}
