import Client from './_component/Client';
import OrderBlockForm from './_component/OrderBlockForm';

export default async function Admin() {
  return (
    <div>
      {process.env.NODE_ENV === 'development' ? <Client /> : null}
      <OrderBlockForm />
    </div>
  );
}
