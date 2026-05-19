export function Header() {
  return (
    <header className="mb-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">WeatherWise</h1>
        <p className="text-lg text-gray-600 mt-1">by Juan Sebastian Urrea</p>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto italic">
          &quot;By making industry-leading tools and education available to individuals from all
          backgrounds, we level the playing field for future PM leaders.&quot;
          <span className="block mt-1 text-xs not-italic text-gray-400">— PM Accelerator</span>
        </p>
      </div>
    </header>
  )
}
