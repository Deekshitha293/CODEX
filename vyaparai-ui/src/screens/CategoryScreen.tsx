import { Boxes, Milk, Pill, ShoppingCart, Sprout, Store, UtensilsCrossed, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Card, SearchBar } from '../components/ui';

const categories = [
  { title: 'Medical Store', subtitle: 'PHARMACY', icon: Pill },
  { title: 'Grocery Store', subtitle: 'KIRANA', icon: ShoppingCart },
  { title: 'Agriculture', subtitle: 'FERTILIZER', icon: Sprout },
  { title: 'Wholesale', subtitle: 'BOX SHOP', icon: Boxes },
  { title: 'Dairy Store', subtitle: 'BEVERAGE', icon: Milk },
  { title: 'Cosmetics', subtitle: 'PERSONAL CARE', icon: Store },
  { title: 'Bakery / Food', subtitle: 'FOOD', icon: UtensilsCrossed },
  { title: 'Hardware Store', subtitle: 'TOOLS', icon: Wrench },
];

export function CategoryScreen() {
  return (
    <main className="screen-shell">
      <h1 className="text-heading">Select Your Shop Type</h1>
      <p className="mb-4 mt-2 text-body text-text-secondary">Choose the category that best describes your business.</p>
      <SearchBar />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="p-4">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold">{category.title}</h3>
              <p className="text-small text-text-secondary">{category.subtitle}</p>
            </Card>
          );
        })}
      </div>
      <div className="mt-6">
        <Link to="/login">
          <Button icon>Continue</Button>
        </Link>
      </div>
      <BottomTabBar />
    </main>
  );
}
