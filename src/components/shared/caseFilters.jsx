import { observer } from "mobx-react-lite";
import { caseStore } from "../../store/CaseStore";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "../../utils/categories";

export const CaseFilters = observer(() => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="relative md:col-span-8 w-full flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search cases..."
            value={caseStore.searchQuery}
            onChange={(e) => caseStore.setSearchQuery(e.target.value)}
            className="pl-12 bg-white border-slate-200 focus-visible:ring-amber-500 rounded-2xl h-12 text-base placeholder:text-slate-400 w-full"
          />
        </div>

        <div className="md:col-span-4 w-full flex items-center">
          <Select
            value={caseStore.sortBy}
            onValueChange={(val) => caseStore.setSortBy(val)}
          >
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white focus:ring-amber-500 text-base font-normal text-slate-700 px-4 w-full flex items-center">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue placeholder="Newest" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap md:flex-wrap w-full">
        <Badge
          variant={caseStore.categoryFilter === "all" ? "default" : "outline"}
          onClick={() => caseStore.setCategoryFilter("all")}
          className={`cursor-pointer rounded-full px-7 py-3.5 text-base font-medium tracking-wide border transition-all duration-200 shrink-0 select-none shadow-sm ${
            caseStore.categoryFilter === "all"
              ? "bg-amber-600 hover:bg-amber-700 text-white border-transparent"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          🌐 All
        </Badge>

        {CATEGORIES.map((cat) => {
          const isSelected = caseStore.categoryFilter === cat.id;
          return (
            <Badge
              key={cat.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => caseStore.setCategoryFilter(cat.id)}
              className={`cursor-pointer rounded-full px-7 py-3.5 text-base font-medium tracking-wide border transition-all duration-200 shrink-0 select-none shadow-sm ${
                isSelected
                  ? "bg-amber-600 hover:bg-amber-700 text-white border-transparent"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="mr-2.5 text-lg">{cat.icon}</span>
              {cat.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
});
