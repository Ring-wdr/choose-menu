import { crawlAndSaveMenuByCategory } from '@/database/coffeebean/post';

import Client from './_component/Client';
import OrderBlockForm from './_component/OrderBlockForm';

export default async function Admin() {
  return (
    <div className="w-full">
      <Client crawlAndSaveMenuByCategory={crawlAndSaveMenuByCategory} />
      <OrderBlockForm />
    </div>
  );
}
