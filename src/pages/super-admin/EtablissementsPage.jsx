import React, { useMemo, useState } from "react";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import {
	Card,
	SectionTitle,
	ActionsMenu,
	TypeBadge,
	StatutBadge,
} from "../../components/super-admin/SharedComponents.jsx";
import { ETABLISSEMENTS, TYPES_ETAB } from "../../data/superAdminMockData.js";
import { Link } from "react-router-dom";
export default function EtablissementsPage() {
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("Tous");
	const [page, setPage] = useState(1);
	const perPage = 6;

	const filtered = useMemo(() => {
		return ETABLISSEMENTS.filter((e) => {
			const q = search.trim().toLowerCase();
			const matchSearch =
				q === "" ||
				e.nom.toLowerCase().includes(q) ||
				e.ville.toLowerCase().includes(q) ||
				e.directeur.toLowerCase().includes(q);
			const matchType = typeFilter === "Tous" || e.type === typeFilter;
			return matchSearch && matchType;
		});
	}, [search, typeFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
	const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

	return (
		<div className="space-y-5">
			<Card className="p-5">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex flex-col sm:flex-row gap-3 flex-1">
						<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex-1 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
							<Search size={16} className="text-slate-400" />
							<input
								value={search}
								onChange={(e) => { setSearch(e.target.value); setPage(1); }}
								placeholder="Rechercher un établissement, une ville ou un directeur..."
								className="bg-transparent text-sm outline-none w-full font-body text-slate-700 placeholder:text-slate-400"
							/>
						</div>

						<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
							<Filter size={15} className="text-slate-400" />
							<select
								value={typeFilter}
								onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
								className="bg-transparent text-sm outline-none font-body text-slate-700 cursor-pointer"
							>
								<option>Tous</option>
								{TYPES_ETAB.map((t) => (
									<option key={t}>{t}</option>
								))}
							</select>
						</div>
					</div>

					<button className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
						<Plus size={16} strokeWidth={2.5} />
						<Link to="/dashboard/super-admin/register/etablissement">Ajouter un établissement</Link>
					</button>
				</div>
			</Card>

			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm font-body">
						<thead>
							<tr className="text-left bg-slate-50/70 text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
								<th className="px-6 py-3.5 font-semibold">Établissement</th>
								<th className="px-6 py-3.5 font-semibold">Ville</th>
								<th className="px-6 py-3.5 font-semibold">Type</th>
								<th className="px-6 py-3.5 font-semibold">Directeur</th>
								<th className="px-6 py-3.5 font-semibold">Créé le</th>
								<th className="px-6 py-3.5 font-semibold">Statut</th>
								<th className="px-6 py-3.5 font-semibold text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{pageItems.map((e) => (
								<tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
									<td className="px-6 py-4">
										<p className="font-semibold text-slate-800">{e.nom}</p>
										<p className="text-xs text-slate-400">{e.eleves.toLocaleString("fr-FR")} élèves</p>
									</td>
									<td className="px-6 py-4 text-slate-500">
										<span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-slate-300" />{e.ville}</span>
									</td>
									<td className="px-6 py-4"><TypeBadge type={e.type} /></td>
									<td className="px-6 py-4 text-slate-500">{e.directeur}</td>
									<td className="px-6 py-4 text-slate-500">{e.dateCreation}</td>
									<td className="px-6 py-4"><StatutBadge statut={e.statut} /></td>
									<td className="px-6 py-4 text-right"><ActionsMenu onAction={(act) => console.log(`Action ${act} on ${e.nom}`)} /></td>
								</tr>
							))}
							{pageItems.length === 0 && (
								<tr>
									<td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-body">Aucun établissement ne correspond à votre recherche.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
					<p className="text-xs text-slate-400 font-body">
						Page {page} sur {totalPages} — {filtered.length} établissement{filtered.length > 1 ? "s" : ""}
					</p>
					<div className="flex items-center gap-2">
						<button
							disabled={page === 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
						>
							<ChevronLeft size={15} />
						</button>
						<button
							disabled={page === totalPages}
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
						>
							<ChevronRight size={15} />
						</button>
					</div>
				</div>
			</Card>
		</div>
	);
}
