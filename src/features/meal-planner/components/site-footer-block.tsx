export function SiteFooterBlock() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm pt-20 pb-10 border-t border-gray-200/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#ec7f13] rounded-[8px] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tighter">FreshPlate</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              通过便捷的营养知识和正念饮食，赋能每个人过上更健康的生活。我们深信新鲜食材的力量。
            </p>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-8">快速链接</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-semibold">
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">浏览菜谱</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">定制饮食计划</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">健康博客</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">成功案例</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-8">支持</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-semibold">
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">联系我们</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">常见问题</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">隐私政策</a></li>
              <li><a className="hover:text-[#ec7f13] transition-colors" href="#">服务条款</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-8">关注我们的旅程</h5>
            <div className="flex gap-4">
              <a className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#ec7f13] hover:text-white transition-all text-gray-400 shadow-sm border border-gray-100" href="#">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#ec7f13] hover:text-white transition-all text-gray-400 shadow-sm border border-gray-100" href="#">
                <span className="sr-only">Pinterest</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-400 font-medium">© 2024 FreshPlate Healthy Recipes. 保留所有权利。</p>
          <div className="flex gap-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <a className="hover:text-[#ec7f13] transition-colors" href="#">广告选择</a>
            <a className="hover:text-[#ec7f13] transition-colors" href="#">Cookie 政策</a>
            <a className="hover:text-[#ec7f13] transition-colors" href="#">偏好管理</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
