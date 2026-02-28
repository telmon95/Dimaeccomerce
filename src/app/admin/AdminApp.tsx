import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { ProductCreate, ProductEdit, ProductList } from './products';
import { OrderList } from './orders';

export default function AdminApp() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
      />
      <Resource name="orders" list={OrderList} />
    </Admin>
  );
}
