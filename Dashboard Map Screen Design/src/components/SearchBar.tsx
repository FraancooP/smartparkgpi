import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function SearchBar() {
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="¿Donde queres ir?"
          className="pl-12 h-12 bg-white/95 backdrop-blur-sm border-border shadow-lg rounded-full"
        />
      </div>
    </div>
  );
}