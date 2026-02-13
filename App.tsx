
import React, { useState, useEffect } from 'react';
import { PaymentForm } from './components/PaymentForm';
import { SellForm } from './components/SellForm';
import { Market } from './components/Market';
import { BuyMinecraft } from './components/BuyMinecraft';
import { LoginForm } from './components/LoginForm';
import { View, User } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.MARKET);
  const [selectedListing, setSelectedListing] = useState<{ productNo: string; amount: number } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('arif_smp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (ign: string, email: string) => {
    setUser({ ign, email, isLoggedIn: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('arif_smp_user');
    setUser(null);
  };

  const handleBuyFromMarket = (productNo: string, amount: number) => {
    setSelectedListing({ productNo, amount });
    setActiveView(View.BUY);
  };

  const getHeroContent = () => {
    switch(activeView) {
      case View.MARKET:
        return {
          badge: "Live Marketplace",
          title: <>Explore the <br/><span className="text-orange-500">Marketplace</span></>,
          desc: "প্লেয়ারদের ল্যান্ড লিস্টিং দেখুন এবং সরাসরি তাদের সাথে যোগাযোগ করে ল্যান্ড কিনুন। এটি একটি সম্পূর্ণ অটোমেটেড মার্কেটপ্লেস।"
        };
      case View.BUY:
        return {
          badge: "Checkout",
          title: <>Finalize Your <br/><span className="text-[#e2136e]">Purchase</span></>,
          desc: "আপনি যে ল্যান্ডটি পছন্দ করেছেন তার পেমেন্ট সম্পন্ন করুন। ভেরিফিকেশনের পর প্রপার্টি আপনার নামে ট্রান্সফার করা হবে।"
        };
      case View.SELL:
        return {
          badge: "Sell Your Land",
          title: <>List Your <br/><span className="text-blue-500">Property</span></>,
          desc: "আপনার ল্যান্ড বা প্রপার্টি অন্য প্লেয়ারদের কাছে বিক্রি করার জন্য লিস্টিং তৈরি করুন। কোঅর্ডিনেট এবং সঠিক মূল্য দিয়ে একটি ইউনিক কোড জেনারেট করুন।"
        };
      case View.MINECRAFT:
        return {
          badge: "Premium Account",
          title: <>Get Minecraft <br/><span className="text-green-500">For 50 BDT</span></>,
          desc: "অরিজিনাল Minecraft Bedrock একাউন্ট কিনুন মাত্র ৫০ টাকায়। ফুল এক্সেস এবং লাইফটাইম গ্যারান্টি। অর্ডার কনফার্ম হওয়ার পর আপনার Gmail-এ সরাসরি Minecraft Bedrock পাঠিয়ে দেওয়া হবে।"
        };
    }
  };

  if (checkingAuth) return null;

  if (!user || !user.isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const hero = getHeroContent();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e2136e] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e2136e] rounded-lg flex items-center justify-center rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <i className="fas fa-cube text-white"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tighter mc-shadow">ARIF <span className="text-[#e2136e]">SMP</span></h1>
          </div>
          
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400 items-center">
            <button 
              onClick={() => setActiveView(View.MARKET)}
              className={`transition-all px-4 py-2 rounded-lg font-bold ${activeView === View.MARKET ? 'text-white bg-white/10' : 'hover:text-white'}`}
            >
              Market
            </button>
            <button 
              onClick={() => setActiveView(View.MINECRAFT)}
              className={`transition-all px-4 py-2 rounded-lg font-bold ${activeView === View.MINECRAFT ? 'text-green-500 bg-green-500/10' : 'hover:text-white'}`}
            >
              Buy Minecraft
            </button>
            <button 
              onClick={() => setActiveView(View.SELL)}
              className={`transition-all px-4 py-2 rounded-lg font-bold ${activeView === View.SELL ? 'text-blue-500 bg-blue-500/10' : 'hover:text-white'}`}
            >
              Sell
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            
            {/* User Profile Area */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                    <span className="text-white text-xs font-bold leading-none">{user.ign}</span>
                    <span className="text-[10px] text-gray-500 leading-none mt-1">{user.email}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5"
                    title="Logout"
                >
                    <i className="fas fa-sign-out-alt text-xs"></i>
                </button>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-gray-400" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-6 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest w-fit">
            <span className={`w-2 h-2 rounded-full animate-pulse ${activeView === View.MARKET ? 'bg-orange-500' : activeView === View.BUY ? 'bg-[#e2136e]' : activeView === View.SELL ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            {hero.badge}
          </div>
          
          <h2 className="text-5xl font-black tracking-tight leading-tight">
            {hero.title}
          </h2>

          <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
             <button 
               onClick={() => setActiveView(View.MARKET)}
               className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeView === View.MARKET ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
             >
               <i className="fas fa-store"></i> Market
             </button>
             <button 
               onClick={() => setActiveView(View.MINECRAFT)}
               className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeView === View.MINECRAFT ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
             >
               <i className="fas fa-gamepad"></i> Buy Minecraft
             </button>
             <button 
               onClick={() => setActiveView(View.SELL)}
               className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeView === View.SELL ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
             >
               <i className="fas fa-plus"></i> Sell Land
             </button>
          </div>
        </div>

        <div className="relative animate-in slide-in-from-right duration-700">
          <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full transition-colors duration-1000 ${activeView === View.BUY ? 'bg-[#e2136e]/20' : activeView === View.SELL ? 'bg-blue-500/20' : activeView === View.MINECRAFT ? 'bg-green-500/10' : 'bg-orange-500/10'}`}></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
          
          {activeView === View.BUY && (
            <PaymentForm 
              initialData={selectedListing} 
              onCancel={() => {
                setActiveView(View.MARKET);
                setSelectedListing(null);
              }}
            />
          )}
          {activeView === View.SELL && <SellForm />}
          {activeView === View.MARKET && <Market onBuy={handleBuyFromMarket} />}
          {activeView === View.MINECRAFT && <BuyMinecraft />}
        </div>
      </main>

      {/* Trust Badges */}
      <section className="border-y border-white/5 bg-white/2 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 text-xs font-black uppercase tracking-[0.3em]">
           <div className="flex items-center gap-2"><i className="fas fa-gem text-[#e2136e]"></i> PREMIUM ITEMS</div>
           <div className="flex items-center gap-2"><i className="fas fa-map-marked-alt text-orange-500"></i> LAND MARKET</div>
           <div className="flex items-center gap-2"><i className="fas fa-shield-halved text-blue-500"></i> SECURE TRADE</div>
           <div className="flex items-center gap-2"><i className="fas fa-bolt text-yellow-500"></i> INSTANT DELIVERY</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-gray-500 text-sm">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 grayscale opacity-80">
                <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                  <i className="fas fa-cube text-black"></i>
                </div>
                <h1 className="text-lg font-bold tracking-tighter">ARIF <span className="text-[#e2136e]">SMP</span></h1>
              </div>
              <p>The #1 Survival Multiplayer experience in the region. Join us for an adventure like no other.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Navigation</h5>
            <ul className="flex flex-col gap-2">
              <li><button onClick={() => setActiveView(View.MARKET)} className="hover:text-white transition-colors">Marketplace</button></li>
              <li><button onClick={() => setActiveView(View.MINECRAFT)} className="hover:text-green-500 transition-colors">Buy Minecraft</button></li>
              <li><button onClick={() => setActiveView(View.SELL)} className="hover:text-blue-500 transition-colors">Sell Land</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Follow Us</h5>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
              <a href="#" className="hover:text-[#5865F2]"><i className="fab fa-discord"></i></a>
              <a href="#" className="hover:text-red-500"><i className="fab fa-youtube"></i></a>
              <a href="#" className="hover:text-pink-500"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-[10px] opacity-50 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Arif SMP. Not affiliated with Mojang AB or Microsoft.
        </div>
      </footer>
    </div>
  );
};

export default App;
