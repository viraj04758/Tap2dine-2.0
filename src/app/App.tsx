import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// Placeholder images (Figma-exported images not bundled in PDF)
const img0 = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=900&fit=crop&auto=format";
const img1 = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=900&fit=crop&auto=format";
const img2 = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=900&fit=crop&auto=format";
const img3 = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=900&fit=crop&auto=format";
const img4 = "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&h=900&fit=crop&auto=format";
const img5 = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=900&fit=crop&auto=format";

// ─── FONTS ───────────────────────────────────────────────────
const serif = "'Playfair Display', Georgia, serif";
const garamond = "'EB Garamond', Georgia, serif";
const josefin = "'Josefin Sans', sans-serif";
// ─── DATA ─────────────────────────────────────────────────────
const NAV_LEFT = ["EXPLORE", "MENUS", "ABOUT"];
const NAV_RIGHT = ["VISIT", "SHOP"];

const MENU_CATEGORIES = [
"All Day",
"Breakfast",
"Small Plates",
"Mains",
"Puddings",
"Group Feast",
"Drinks",
];
type MenuItem = { name: string; desc: string; price: string; tag?: string };
const MENU_ITEMS: Record<string, MenuItem[]> = {
"All Day": [
{ name: "House Daal", desc: "Our daal is slow-cooked overnight — black lentils, tomato, cream, whisper of spice", price: "£7.90" },
{ name: "Roomali Roti", desc: "The thinnest bread, folded like a handkerchief, served warm", price: "£3.50" },
{ name: "Masala Chai", desc: "Black tea steeped with cardamom, ginger, cinnamon, whole milk", price: "£3.20" },
{ name: "Pau Bhaji", desc: "Spiced vegetable mash, butter-griddled bread, a squeeze of lime", price: "£8.50", tag: "Staff Favourite" },
],
Breakfast: [
{ name: "Bacon Naan Roll", desc: "Smoked streaky bacon, cream cheese, chilli tomato jam, fresh coriander", price: "£9.90", tag: "Beloved" },
{ name: "Kejriwal", desc: "Two fried eggs on chilli cheese toast — named after the man who ordered it daily", price: "£9.50" },
{ name: "Dishoom Fry", desc: "The full works: eggs your way, sausage, bacon, mushroom, toast, chai", price: "£14.90" },
{ name: "Akuri on Toast", desc: "Spiced scrambled eggs, green chilli, coriander, griddled sourdough", price: "£10.50" },
],
"Small Plates": [
{ name: "Chicken Ruby", desc: "Our classic ruby chicken curry — slow-cooked, tomato-rich, bone-in", price: "£14.50" },
{ name: "Lamb Chops", desc: "Overnight marinated with yoghurt, papaya, chilli — char-grilled, served pink", price: "£17.50", tag: "Must Try" },
{ name: "Paneer Tikka", desc: "Fresh paneer, peppers, onion — tikka spiced, tandoor finished", price: "£13.50" },
{ name: "Bhel", desc: "Puffed rice, raw mango, tamarind, green chutney — the Bombay street classic", price: "£7.90" },
],
Mains: [
{ name: "Jackfruit Biryani", desc: "Fragrant basmati, tender jackfruit, caramelised onion, boiled egg, raita", price: "£16.50" },
{ name: "Mutton Berry Pulao", desc: "Bone-in mutton, dried barberries, caramelised onion, saffron rice", price: "£19.50", tag: "Signature" },
{ name: "Chicken Irani Café", desc: "Char-grilled chicken thigh, green masala, lemon, paratha", price: "£17.50" },
{ name: "Prawn Koliwada", desc: "Carom-seed battered prawns, green chutney, pickled onion, lime", price: "£16.90" },
],
Puddings: [
{ name: "Gulab Jamun", desc: "Rose-syrup soaked milk dumplings, cardamom cream — warm and yielding", price: "£7.50" },

{ name: "House Kulfi", desc: "Hand-set pistachio and cardamom kulfi, rose petal, saffron", price: "£7.50" },
{ name: "Shrikhand", desc: "Hung yoghurt sweetened with saffron and cardamom, mango compote", price: "£7.00" },
{ name: "Chocolate Nemesis", desc: "Dense Valrhona chocolate tart, clotted cream, spiced orange", price: "£8.50" },
],
"Group Feast": [
{ name: "The Bombay Feast", desc: "A spread for four or more — lamb chops, chicken ruby, daal, breads, salad, pickles", price: "£42 pp", tag: "Min. 4 guests" },
{ name: "The Vegetarian Feast", desc: "Paneer tikka, jackfruit biryani, daal, chaat, breads — for the whole table", price: "£36 pp", tag: "Min. 4 guests" },
],
Drinks: [
{ name: "Masala Chai", desc: "The very reason we exist — black tea, whole milk, spices, brewed long", price: "£3.20" },
{ name: "Permit Room Spritz", desc: "London dry gin, Bombay tonic, fresh lime, cucumber", price: "£12.50" },
{ name: "Lassi", desc: "Salted or sweet — house-set yoghurt, blended to order", price:
"£5.50" },
{ name: "Fresh Lime Soda", desc: "Lime, soda water, pinch of salt and cumin — the original sports drink", price: "£4.50" },
],
};
const CARDS = [
{
title: "MENUS",
sub: "Explore all our café menus",
img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h= 900&fit=crop&auto=format",
href: "menu",
},
{
title: "RESERVATIONS",
sub: "To book a table or enquire",
img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=900 &fit=crop&auto=format",
href: "reserve",
},
{
title: "OUR STORY",
sub: "The people and the place",
img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=900 &fit=crop&auto=format",
href: "about",
},
];
// ─── ORNAMENT ─────────────────────────────────────────────────
function Ornament({ className = "" }: { className?: string }) {
return (
<div className={`flex items-center gap-3 ${className}`}>
<div className="h-px flex-1 bg-current opacity-30" />
<span className="opacity-50 text-xs">✦</span>
<div className="h-px flex-1 bg-current opacity-30" />

</div>
);
}
// ─── APP ──────────────────────────────────────────────────────
export default function App() {
const [mobileOpen, setMobileOpen] = useState(false);
const [activeSection, setActiveSection] = useState("home");
const [activeCategory, setActiveCategory] = useState("All Day");
const [scrolled, setScrolled] = useState(false);
const [reserveForm, setReserveForm] = useState({
name: "", email: "", date: "", time: "19:00", guests: "2", notes: "",
});
const [reserveSubmitted, setReserveSubmitted] = useState(false);
useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 80);
window.addEventListener("scroll", onScroll);
return () => window.removeEventListener("scroll", onScroll);
}, []);
const scrollTo = (id: string) => {
setMobileOpen(false);
setActiveSection(id);
const el = document.getElementById(id);
if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
const handleReserve = (e: React.FormEvent) => {
e.preventDefault();
setReserveSubmitted(true);
};
const currentItems = MENU_ITEMS[activeCategory] || [];
return (
<div
className="min-h-screen bg-background text-foreground"
style={{ fontFamily: garamond }}
>
{/* ══════════════════════════════════════════
NAV — Dishoom-style: left links | logo | right links
══════════════════════════════════════════ */}
<header
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
scrolled
? "bg-[#f5e8cc]/95 backdrop-blur-md shadow-sm border-b border-[rgba(110,70,25,0.15)]"
: "bg-transparent"
}`}
>
{/* thin top bar */}
<div className="border-b border-[rgba(110,70,25,0.1)] py-1.5 px-6 hidden md:flex items-center justify-between text-[10px] tracking-[0.22em] text-muted-foreground"
style={{ fontFamily: josefin }}>
<span>EST. 2024 · FINE DINING & CAFÉ</span>

<span>OPEN DAILY · 7AM – 11PM</span>
</div>
<nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
{/* left links */}
<div className="hidden md:flex items-center gap-8">
{NAV_LEFT.map((l) => (
<button
key={l}
onClick={() => scrollTo(l.toLowerCase())}
className="text-[11px] tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors duration-300"
style={{ fontFamily: josefin }}
>
{l}
</button>
))}
</div>
{/* logo — centre */}
<button
onClick={() => scrollTo("home")}
className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:block"
>
<span
className="text-foreground tracking-[0.12em] text-2xl"
style={{ fontFamily: serif, fontWeight: 500 }}
>
Tap2Dine
</span>
</button>
{/* mobile logo */}
<button onClick={() => scrollTo("home")} className="md:hidden">
<span className="text-foreground text-xl" style={{ fontFamily: serif, fontWeight:
500 }}>
Tap2Dine
</span>
</button>
{/* right links */}
<div className="hidden md:flex items-center gap-8 ml-auto">
{NAV_RIGHT.map((l) => (
<button
key={l}
onClick={() => scrollTo(l.toLowerCase())}
className="text-[11px] tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors duration-300"
style={{ fontFamily: josefin }}
>
{l}
</button>
))}
<button

onClick={() => scrollTo("reserve")}
className="border border-foreground text-foreground text-[10px] tracking-[0.2em] px-5 py-2 hover:bg-foreground hover:text-background transition-all duration-300"
style={{ fontFamily: josefin }}
>
BOOK A TABLE
</button>
</div>
{/* mobile burger */}
<button
className="md:hidden ml-auto text-foreground"
onClick={() => setMobileOpen(!mobileOpen)}
>
{mobileOpen ? <X size={20} /> : <Menu size={20} />}
</button>
</nav>
{/* mobile drawer */}
{mobileOpen && (
<div className="md:hidden bg-[#f5e8cc] border-t border-[rgba(110,70,25,0.15)] px-6 py-8">
<ul className="space-y-6">
{[...NAV_LEFT, ...NAV_RIGHT, "RESERVE"].map((l) => (
<li key={l}>
<button
onClick={() => scrollTo(l.toLowerCase())}
className="text-[11px] tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors"
style={{ fontFamily: josefin }}
>
{l}
</button>
</li>
))}
<li>
<button
onClick={() => scrollTo("reserve")}
className="border border-foreground text-foreground text-[10px] tracking-[0.2em] px-6 py-2.5"
style={{ fontFamily: josefin }}
>
BOOK A TABLE
</button>
</li>
</ul>
</div>
)}
</header>
{/* ══════════════════════════════════════════
HERO — cinematic dark with parchment title
══════════════════════════════════════════ */}
<section id="home" className="relative h-screen min-h-[640px] flex items-end justify-center overflow-hidden">
<div className="absolute inset-0 bg-[#1a0f06]">

<img
src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&h =1200&fit=crop&auto=format"
alt="Tap2Dine interior"
className="w-full h-full object-cover opacity-50"
/>
{/* grain texture overlay */}
<div
className="absolute inset-0 opacity-30 mix-blend-multiply"
style={{
backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
backgroundSize: "200px",
}}
/>
<div className="absolute inset-0 bg-gradient-to-t from-[#1a0f06] via-[#1a0f06]/30 to-[#1a0f06]/40" />
</div>
<div className="relative z-10 text-center px-6 pb-24 max-w-3xl mx-auto">
<p
className="text-[#c4952a] text-[10px] tracking-[0.35em] mb-6"
style={{ fontFamily: josefin }}
>
BOMBAY · LONDON · EST. 2024
</p>
<Ornament className="text-[#c4952a] mb-8 max-w-xs mx-auto" />
<h1
className="text-[#f0ddb5] leading-none mb-6"
style={{
fontFamily: serif,
fontSize: "clamp(3.8rem, 10vw, 9rem)",
fontWeight: 400,
letterSpacing: "-0.01em",
}}
>
Tap2Dine
</h1>
<p
className="text-[#f0ddb5]/75 text-xl italic mb-10 leading-relaxed"
style={{ fontFamily: garamond }}
>
"By the end, we hope you will feel as though you have dined in Bombay with us, and tasted what we treasure."
</p>
<Ornament className="text-[#c4952a] mb-10 max-w-xs mx-auto" />
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<button
onClick={() => scrollTo("menus")}
className="text-[#f0ddb5] border border-[#f0ddb5]/50 px-8 py-3 text-[11px] tracking-[0.22em] hover:bg-[#f0ddb5] hover:text-[#1a0f06] transition-all duration-400"
style={{ fontFamily: josefin }}

>
VIEW MENUS
</button>
<button
onClick={() => scrollTo("reserve")}
className="bg-[#c4952a] text-[#1a0f06] px-8 py-3 text-[11px] tracking-[0.22em] hover:bg-[#d4a540] transition-all duration-300"
style={{ fontFamily: josefin }}
>
BOOK A TABLE
</button>
</div>
</div>
</section>
{/* ══════════════════════════════════════════
INTRO — editorial text + hero food photo (like Dishoom "Our Menus" section)
══════════════════════════════════════════ */}
<section className="bg-background py-24 lg:py-32">
<div className="max-w-6xl mx-auto px-6 lg:px-10">
<div className="grid lg:grid-cols-2 gap-16 items-center">
<div className="order-2 lg:order-1">
<p
className="text-accent text-[10px] tracking-[0.3em] mb-6"
style={{ fontFamily: josefin }}
>
BOMBAY COMFORT FOOD
</p>
<h2
className="text-foreground leading-tight mb-7"
style={{ fontFamily: serif, fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 400 }}
>
Our Menus
</h2>
<Ornament className="text-foreground mb-7 max-w-[80px]" />
<div className="space-y-5 text-foreground/80 leading-relaxed" style={{ fontSize:
"1.125rem" }}>
<p>
At Tap2Dine, you will find the food of all Bombay: its cafés, grills, street stalls, home
cooks and everything in between. Come, eat your way through the city with us, for
breakfast, lunch, brunch, chai, dinner or late-night supper.
</p>
<p>
Hidden gems, lowly heroines, the most delicious comfort food and countless stories to
be told.
</p>
</div>
<button
onClick={() => scrollTo("menus")}
className="mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.22em] text-foreground border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors duration-300"
style={{ fontFamily: josefin }}
>
SELECT A MENU
<ArrowRight size={12} />

</button>
</div>
<div className="order-1 lg:order-2">
<div className="aspect-[4/5] overflow-hidden bg-muted">
<img
src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=1 100&fit=crop&auto=format"
alt="Tap2Dine signature dish"
className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
/>
</div>
</div>
</div>
</div>
</section>
{/* ══════════════════════════════════════════
MENUS — Dishoom-style sidebar selector
══════════════════════════════════════════ */}
<section id="menus" className="bg-[#efe0bc] py-24 lg:py-32 border-t border-border">
<div className="max-w-6xl mx-auto px-6 lg:px-10">
<div className="mb-14">
<p
className="text-accent text-[10px] tracking-[0.3em] mb-3"
style={{ fontFamily: josefin }}
>
SELECT A MENU
</p>
</div>
<div className="grid lg:grid-cols-[240px_1fr] gap-12">
{/* sidebar */}
<aside>
<ul className="space-y-1">
{MENU_CATEGORIES.map((cat) => (
<li key={cat}>
<button
onClick={() => setActiveCategory(cat)}
className={`w-full text-left py-3 px-4 text-lg transition-all duration-200 border-l-2 ${
activeCategory === cat
? "border-foreground text-foreground bg-[#e8d5a8]"
: "border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/30"
}`}
style={{ fontFamily: serif, fontWeight: activeCategory === cat ? 500 : 400 }}
>
{cat}
</button>
</li>
))}
</ul>
</aside>
{/* items */}
<div>

<h3
className="text-foreground mb-8 text-3xl"
style={{ fontFamily: serif, fontWeight: 400 }}
>
{activeCategory}
</h3>
<div className="divide-y divide-border">
{currentItems.map((item) => (
<div key={item.name} className="py-7 flex items-start justify-between gap-6 group">
<div className="flex-1">
<div className="flex items-center gap-3 mb-2 flex-wrap">
<h4
className="text-foreground text-xl group-hover:text-accent transition-colors duration-300"
style={{ fontFamily: serif, fontWeight: 400 }}
>
{item.name}
</h4>
{item.tag && (
<span
className="text-[9px] tracking-[0.18em] text-accent border border-accent/40 px-2 py-0.5"
style={{ fontFamily: josefin }}
>
{item.tag}
</span>
)}
</div>
<p className="text-foreground/60 text-base leading-relaxed max-w-xl" style={{
fontFamily: garamond }}>
{item.desc}
</p>
</div>
<span
className="text-foreground/80 text-lg shrink-0 mt-1"
style={{ fontFamily: serif }}
>
{item.price}
</span>
</div>
))}
</div>
<div className="mt-10 pt-8 border-t border-border">
<p className="text-foreground/50 text-sm italic" style={{ fontFamily: garamond }}>
All dishes may contain traces of nuts, gluten, or dairy. Please inform your server of any
allergies.
Prices include VAT. Service charge of 12.5% is added to all bills.
</p>
</div>
</div>
</div>
</div>
</section>
{/* ══════════════════════════════════════════

ABOUT — editorial split (like Dishoom café story)
══════════════════════════════════════════ */}
<section id="about" className="bg-background py-24 lg:py-32 border-t border-border">
<div className="max-w-6xl mx-auto px-6 lg:px-10">
<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
{/* image col */}
<div className="space-y-4">
<div className="aspect-[3/4] overflow-hidden bg-muted">
<img
src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=120 0&fit=crop&auto=format"
alt="Tap2Dine café interior"
className="w-full h-full object-cover"
/>
</div>
<div className="aspect-video overflow-hidden bg-muted">
<img
src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=500 &fit=crop&auto=format"
alt="Tap2Dine kitchen"
className="w-full h-full object-cover"
/>
</div>
</div>
{/* text col */}
<div className="lg:pt-12">
<p
className="text-accent text-[10px] tracking-[0.3em] mb-6"
style={{ fontFamily: josefin }}
>
OUR STORY
</p>
<h2
className="text-foreground leading-tight mb-6"
style={{ fontFamily: serif, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 400 }}
>
The Irani Café,
<br />
<em>reimagined</em>
</h2>
<Ornament className="text-foreground mb-8 max-w-[80px]" />
<div className="space-y-5 text-foreground/75 leading-relaxed" style={{ fontSize:
"1.1rem" }}>
<p>
Tap2Dine came together to become Dishoom: it is a city of ancient and impassioned
extremes formed in light by the ocean on three sides. And yet, just the results and
between the layers of accumulated difference, there is magic.
</p>
<p>
Hidden gems, lowly heroines, the most delicious comfort food and countless stories to
be told. We cook not for trends, but for memory. Every dish a postcard from
somewhere we love.
</p>
<p>

Our suppliers are neighbours, our recipes are heirlooms, and our welcome is the same
as it has ever been — come in, sit down, stay a while.
</p>
</div>
<div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-10">
{[
{ num: "1922", label: "Inspired By" },
{ num: "47", label: "Seats" },
{ num: "32+", label: "Producers" },
].map(({ num, label }) => (
<div key={label}>
<p className="text-foreground text-3xl mb-1" style={{ fontFamily: serif, fontWeight:
400 }}>
{num}
</p>
<p className="text-muted-foreground text-[10px] tracking-[0.18em] uppercase"
style={{ fontFamily: josefin }}>
{label}
</p>
</div>
))}
</div>
</div>
</div>
</div>
</section>
{/* ══════════════════════════════════════════
THREE-CARD GRID — Dishoom-style dark photo cards
══════════════════════════════════════════ */}
<section className="bg-background border-t border-border">
<div className="grid md:grid-cols-3">
{CARDS.map((card) => (
<button
key={card.title}
onClick={() => scrollTo(card.href)}
className="group relative aspect-[3/4] overflow-hidden bg-[#1a0f06] text-left"
>
<img
src={card.img}
alt={card.title}
className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
/>
<div className="absolute inset-0 bg-gradient-to-t from-[#1a0f06]/90 via-[#1a0f06]/20 to-transparent" />
<div className="absolute bottom-0 left-0 right-0 p-8">
<Ornament className="text-[#c4952a] mb-5 max-w-[60px]" />
<p
className="text-[#f0ddb5] text-[11px] tracking-[0.28em] mb-2"
style={{ fontFamily: josefin }}
>
{card.title}
</p>
<p
className="text-[#f0ddb5]/70 text-base italic"

style={{ fontFamily: garamond }}
>
{card.sub}
</p>
<div className="mt-5 flex items-center gap-2 text-[#c4952a] text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
style={{ fontFamily: josefin }}>
EXPLORE <ArrowRight size={11} />
</div>
</div>
</button>
))}
</div>
</section>
{/* ══════════════════════════════════════════
RESERVE — booking form
══════════════════════════════════════════ */}
<section id="reserve" className="bg-[#efe0bc] py-24 lg:py-32 border-t border-border">
<div className="max-w-5xl mx-auto px-6 lg:px-10">
<div className="grid lg:grid-cols-[1fr_420px] gap-16">
{/* left */}
<div>
<p
className="text-accent text-[10px] tracking-[0.3em] mb-6"
style={{ fontFamily: josefin }}
>
RESERVATIONS
</p>
<h2
className="text-foreground leading-tight mb-6"
style={{ fontFamily: serif, fontSize: "clamp(2.4rem, 4vw, 3.4rem)", fontWeight: 400 }}
>
Book a Table
</h2>
<Ornament className="text-foreground mb-8 max-w-[80px]" />
<p className="text-foreground/70 leading-relaxed mb-12 max-w-sm" style={{
fontSize: "1.1rem" }}>
We recommend booking two weeks ahead for weekends. Walk-ins are always welcome,
though we cannot guarantee a seat.
</p>
<div className="space-y-7">
{[
{ label: "Opening Hours", value: "Daily, 7:00 AM – 11:00 PM" },
{ label: "Address", value: "14 Antique Lane, Southwark, London SE1 2QX" },
{ label: "Telephone", value: "+44 (0)20 7420 9324" },
{ label: "Email", value: "hello@tap2dine.com" },
].map(({ label, value }) => (
<div key={label} className="border-b border-border pb-5">
<p
className="text-accent text-[9px] tracking-[0.24em] uppercase mb-1.5"
style={{ fontFamily: josefin }}
>
{label}
</p>

<p className="text-foreground/80 text-base" style={{ fontFamily: garamond }}>
{value}
</p>
</div>
))}
</div>
</div>
{/* form */}
<div>
{reserveSubmitted ? (
<div className="flex flex-col items-center justify-center text-center h-full py-16">
<Ornament className="text-accent mb-8 max-w-[80px] mx-auto" />
<h3
className="text-foreground mb-4 text-3xl"
style={{ fontFamily: serif, fontWeight: 400 }}
>
Thank you,
<br />
<em>{reserveForm.name}</em>
</h3>
<p className="text-foreground/70 max-w-xs leading-relaxed" style={{ fontFamily:
garamond }}>
Your reservation request has been received. We will confirm via{" "}
<strong>{reserveForm.email}</strong> within 24 hours.
</p>
<button
onClick={() => setReserveSubmitted(false)}
className="mt-8 text-[10px] tracking-[0.2em] text-accent border-b border-accent pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
style={{ fontFamily: josefin }}
>
MAKE ANOTHER
</button>
</div>
) : (
<form onSubmit={handleReserve} className="space-y-5">
{[
{ id: "name", label: "Full Name", type: "text", placeholder: "Elizabeth Forsythe" },
{ id: "email", label: "Email Address", type: "email", placeholder:
"elizabeth@example.com" },
].map(({ id, label, type, placeholder }) => (
<div key={id}>
<label
htmlFor={id}
className="block text-[9px] tracking-[0.24em] text-foreground/60 uppercase mb-2"
style={{ fontFamily: josefin }}
>
{label}
</label>
<input
id={id}
type={type}
required
placeholder={placeholder}
value={reserveForm[id as keyof typeof reserveForm]}

onChange={(e) => setReserveForm({ ...reserveForm, [id]: e.target.value })}
className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors text-base"
style={{ fontFamily: garamond }}
/>
</div>
))}
<div className="grid grid-cols-2 gap-5">
<div>
<label
htmlFor="date"
className="block text-[9px] tracking-[0.24em] text-foreground/60 uppercase mb-2"
style={{ fontFamily: josefin }}
>
Date
</label>
<input
id="date"
type="date"
required
value={reserveForm.date}
onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-accent transition-colors text-base [color-scheme:light]"
style={{ fontFamily: garamond }}
/>
</div>
<div>
<label
htmlFor="guests"
className="block text-[9px] tracking-[0.24em] text-foreground/60 uppercase mb-2"
style={{ fontFamily: josefin }}
>
Guests
</label>
<select
id="guests"
value={reserveForm.guests}
onChange={(e) => setReserveForm({ ...reserveForm, guests: e.target.value })}
className="w-full bg-transparent border-b border-border py-3 text-foreground focus:outline-none focus:border-accent transition-colors text-base appearance-none"
style={{ fontFamily: garamond }}
>
{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
<option key={n} value={n} className="bg-[#efe0bc]">
{n} {n === 1 ? "guest" : "guests"}
</option>
))}
</select>
</div>
</div>
<div>
<label
htmlFor="notes"
className="block text-[9px] tracking-[0.24em] text-foreground/60 uppercase mb-2"

style={{ fontFamily: josefin }}
>
Special Requests
</label>
<textarea
id="notes"
rows={3}
placeholder="Dietary requirements, allergies, occasions…"
value={reserveForm.notes}
onChange={(e) => setReserveForm({ ...reserveForm, notes: e.target.value })}
className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors text-base resize-none"
style={{ fontFamily: garamond }}
/>
</div>
<div className="pt-4">
<button
type="submit"
className="w-full bg-foreground text-background py-4 text-[11px] tracking-[0.26em] hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-3 group"
style={{ fontFamily: josefin }}
>
REQUEST A TABLE
<ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
</button>
</div>
</form>
)}
</div>
</div>
</div>
</section>
{/* ══════════════════════════════════════════
CLOSING — cinematic dark CTA (like Dishoom's final section)
══════════════════════════════════════════ */}
<section className="relative h-[70vh] min-h-[480px] flex flex-col items-center justify-center overflow-hidden">
<div className="absolute inset-0 bg-[#1a0f06]">
<img
src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&h=90 0&fit=crop&auto=format"
alt="Tap2Dine evening atmosphere"
className="w-full h-full object-cover opacity-40"
/>
<div className="absolute inset-0 bg-gradient-to-b from-[#1a0f06]/60 via-transparent to-[#1a0f06]/80" />
</div>
<div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
<Ornament className="text-[#c4952a] mb-8 max-w-[100px] mx-auto" />
<p
className="text-[#f0ddb5] italic leading-relaxed mb-8"
style={{ fontFamily: garamond, fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}

>
"By the end, we hope you will feel as though you have dined in Bombay with us, and tasted what we treasure."
</p>
<Ornament className="text-[#c4952a] mb-10 max-w-[100px] mx-auto" />
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<button
onClick={() => scrollTo("menus")}
className="text-[#f0ddb5] border border-[#f0ddb5]/40 px-8 py-3 text-[11px] tracking-[0.22em] hover:bg-[#f0ddb5] hover:text-[#1a0f06] transition-all duration-300"
style={{ fontFamily: josefin }}
>
VIEW MENUS
</button>
<button
onClick={() => scrollTo("reserve")}
className="bg-[#c4952a] text-[#1a0f06] px-8 py-3 text-[11px] tracking-[0.22em] hover:bg-[#d4a540] transition-all duration-300"
style={{ fontFamily: josefin }}
>
BOOK A TABLE
</button>
</div>
</div>
</section>
{/* ══════════════════════════════════════════
FOOTER
══════════════════════════════════════════ */}
<footer id="visit" className="bg-[#1a0f06] text-[#f0ddb5] py-16 border-t border-[rgba(196,149,42,0.15)]">
<div className="max-w-6xl mx-auto px-6 lg:px-10">
<div className="grid md:grid-cols-4 gap-10 mb-12">
<div className="md:col-span-1">
<p className="text-2xl mb-4" style={{ fontFamily: serif, fontWeight: 400 }}>
Tap2Dine
</p>
<p className="text-[#f0ddb5]/50 text-sm leading-relaxed" style={{ fontFamily:
garamond }}>
Inspired by the Irani cafés of old Bombay. Made for London.
</p>
</div>
<div>
<p
className="text-[#c4952a] text-[9px] tracking-[0.24em] uppercase mb-5"
style={{ fontFamily: josefin }}
>
Navigate
</p>
<ul className="space-y-3">
{["Explore", "Menus", "About", "Reserve", "Shop", "Visit"].map((l) => (
<li key={l}>
<button
onClick={() => scrollTo(l.toLowerCase())}
className="text-[#f0ddb5]/60 hover:text-[#f0ddb5] text-sm transition-colors"

style={{ fontFamily: garamond }}
>
{l}
</button>
</li>
))}
</ul>
</div>
<div>
<p
className="text-[#c4952a] text-[9px] tracking-[0.24em] uppercase mb-5"
style={{ fontFamily: josefin }}
>
Hours
</p>
<div className="space-y-2 text-[#f0ddb5]/60 text-sm" style={{ fontFamily:
garamond }}>
<p>Monday – Friday</p>
<p className="text-[#f0ddb5]/40 text-xs">7:00 AM – 11:00 PM</p>
<p className="mt-3">Saturday – Sunday</p>
<p className="text-[#f0ddb5]/40 text-xs">8:00 AM – 11:30 PM</p>
</div>
</div>
<div>
<p
className="text-[#c4952a] text-[9px] tracking-[0.24em] uppercase mb-5"
style={{ fontFamily: josefin }}
>
Find Us
</p>
<div className="space-y-1 text-[#f0ddb5]/60 text-sm" style={{ fontFamily:
garamond }}>
<p>14 Antique Lane</p>
<p>Southwark</p>
<p>London SE1 2QX</p>
<p className="mt-4">+44 (0)20 7420 9324</p>
<p>hello@tap2dine.com</p>
</div>
</div>
</div>
<Ornament className="text-[#c4952a] mb-8" />
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
<p
className="text-[#f0ddb5]/30 text-xs"
style={{ fontFamily: josefin, letterSpacing: "0.14em" }}
>
© 2024 TAP2DINE · ALL RIGHTS RESERVED
</p>
<div className="flex items-center gap-8">
{["Privacy Policy", "Terms", "Allergens", "Press"].map((l) => (
<button
key={l}
className="text-[#f0ddb5]/30 hover:text-[#f0ddb5]/70 text-[10px] tracking-[0.14em] transition-colors"

style={{ fontFamily: josefin }}
>
{l}
</button>
))}
</div>
</div>
</div>
</footer>
</div>
);
}
