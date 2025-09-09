
import React from "react";

const cards = [
	{
		title: "Fuel Rewards Card",
		description: "Earn points on every fuel purchase and redeem for discounts.",
		icon: "⛽",
		status: "Active",
		number: "**** 1234",
	},
	{
		title: "Shopping Card",
		description: "Get cashback and exclusive offers at partner stores.",
		icon: "🛒",
		status: "Inactive",
		number: "**** 5678",
	},
	{
		title: "Travel Card",
		description: "Enjoy travel insurance and airport lounge access.",
		icon: "✈️",
		status: "Active",
		number: "**** 9012",
	},
];

export default function CardsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col">
			{/* Header */}
			<div className="bg-white/90 backdrop-blur-lg border-b border-orange-200/40 p-6 shadow-sm">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<h1 className="text-2xl font-bold text-orange-900">My Cards</h1>
					<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all">+ Add Card</button>
				</div>
			</div>

			{/* Card Grid */}
			<div className="flex-1 flex justify-center items-start py-10 px-2">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
					{cards.map((card, idx) => (
						<div
							key={idx}
							className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition-all min-h-[220px]"
						>
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-3xl">
									{card.icon}
								</div>
								<div>
									<h2 className="text-lg font-bold text-orange-900 mb-1">{card.title}</h2>
									<div className="text-xs text-gray-500 font-mono tracking-widest">{card.number}</div>
								</div>
							</div>
							<div className="flex-1 text-slate-700 text-sm">{card.description}</div>
							<div className="flex items-center justify-between mt-2">
								<span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
									{card.status}
								</span>
								<button className="text-orange-600 hover:underline text-xs font-medium">Manage</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
