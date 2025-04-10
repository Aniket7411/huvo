import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout";
import Layoutadmin from "./components/layoutadmin/index.jsx";
import Home from "./pages/home/index.jsx";
import ProductDetails from "./pages/product-details/index.jsx";
import WomenCollection from "./pages/women/index.jsx";
import Collections from "./pages/collections/index.jsx";
import CheckOut from "./pages/checkout/index.jsx";
import Login from "./pages/login/index.jsx";
import SignIn from "./pages/signIn/index.jsx";
import TrackOrder from "./pages/track-order/index.jsx";
import Profile from "./pages/profile/index.jsx";
import UserAuth from "./components/layout/userAuth";
import AdminAuth from "./components/layout/adminAuth";
import ResetPassword from "./pages/reset-password";
import Dashboard from "./pages/superAdmin/dashboard";
import DashboardPage from "./pages/superAdmin/dashboardPage";
import Admin from "./pages/admin";
import BrandAddPage from "./pages/admin/brands/addBrands";
import BrandList from "./pages/admin/brands";
import ProductList from "./pages/admin/products";
import ProductAddPage from "./pages/admin/products/addProducts";
import CategoryList from "./pages/admin/category";
import CategoryAddPage from "./pages/admin/category/addCategory";
import CategoryEditPage from "./pages/admin/category/editCategory";
import BrandEditPage from "./pages/admin/brands/editBrands";
import ProductEditPage from "./pages/admin/products/editProducts";
import KidsCollection from "./pages/kids";
import UserList from "./pages/admin/users";
import WishList from "./pages/wishlist";
import OrderList from "./pages/admin/orders"
import Vendors from "./pages/superAdmin/vendors";
import ProductsAdmin from "./pages/superAdmin/products";
import Buyers from "./pages/superAdmin/buyers"
import Vendorsdetail from "./pages/superAdmin/vendors/vendorsdetails";
import InvoiceAdmin from "./pages/superAdmin/invoice";
import SuperAdminAuth from "./components/layoutsuperadmin/SuperAdminAuth";
import InvoiceDetails from "./pages/superAdmin/invoice/invoicedetails";
import Approval from "./pages/superAdmin/approval";
import ApprovalSlip from "./pages/superAdmin/approval/approvalSlip";
import Search from "./pages/search/index.jsx";
import ProfileAdmin from "./pages/superAdmin/profile/index.jsx";
import Privacypolicy from "./pages/privacy/index.jsx";
import AdminCancelSection from "./pages/admin/admincancel/admincancel.jsx";
import CancelSection from "./pages/cancellation/cancellation.jsx";
import Returnpolicy from "./pages/returnpolicy/index.jsx";
import InvoicePage from "./pages/invoicepage/index.jsx";
import UserInvoicePage from "./pages/userinvoice/index.jsx";
import ProductProvider from "./usecontext1/cartcontext";
import ProductsByBrands from "./pages/brandproducts/index.jsx";
import ProductsByCategory from "./pages/categoryproducts/index.jsx";
import GroceriesHomeApplianceCollection from "./pages/appliances/index.jsx";
import TrendingProducts from "./pages/trendingproducts/index.jsx";
import Advertisement from "./pages/advertisement/index.jsx";
import StoreAndProducts from "./pages/storeandproducts/index.jsx";
import ProductsCarousel from "./pages/productcarousel/index.jsx";
import CartProvider from "./usecontext1/cartcontext";
import CancellationAndRefundPolicies from "./pages/cancellationrefund/index.jsx";
import TermsAndConditions from "./pages/termsincondition/index.jsx";
import ContactUs from "./pages/contactus/index.jsx";
import SellerProducts from "./pages/sellerproducts/index.jsx";
import CategoryPage from "./pages/categorysearch/index.jsx";
import OrderAndReturn from "./pages/orderandreturn/index.jsx";
import CategorySlider from "./pages/categoryslider/index.jsx";
import NewMenCollection from "./pages/newmen/index.jsx";
import ShippingInfo from "./pages/shippingpolicies/index.jsx";
import CheckOutWithoutLogin from "./pages/checkoutwithoutlogin/index.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
        </Routes>


        <Routes>
          <Route
            path="/test"
            element={
              <Layout>
                <CategorySlider />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/carousel"
            element={
              <Layout>
                <ProductsCarousel />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/store_products/:id"
            element={
              <Layout>
                <StoreAndProducts />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/privacy_policy"
            element={
              <Layout>
                <Privacypolicy />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/returnpolicy"
            element={
              <Layout>
                <Returnpolicy />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/shopping_policies"
            element={
              <Layout>
                <ShippingInfo />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/cancellation_refund"
            element={
              <Layout>
                <CancellationAndRefundPolicies />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/contact_us"
            element={
              <Layout>
                <ContactUs />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/termsandconditions"
            element={
              <Layout>
                <TermsAndConditions />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/product-details/:id"
            element={
              <Layout >
                <ProductDetails />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="men-collection"
            element={
              <Layout>
                <NewMenCollection />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="women-collection"
            element={
              <Layout>
                <WomenCollection />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="kids-collection"
            element={
              <Layout>
                <KidsCollection />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="/category_search/:category/:id"
            element={
              <Layout>
                <CategoryPage />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="collections"
            element={
              <Layout changeHeaderColor="true">
                <Collections />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="appliances"
            element={
              <Layout changeHeaderColor="true">
                <GroceriesHomeApplianceCollection />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="search/result"
            element={
              <Layout changeHeaderColor="true">
                <Search />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="products_by_brand"
            element={
              <Layout changeHeaderColor="true">
                <ProductsByBrands />
              </Layout>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="trending_products"
            element={
              <Layout changeHeaderColor="true">
                <TrendingProducts />
              </Layout>
            }
          />
        </Routes>


        <Routes>
          <Route
            path="/products_category"
            element={
              <Layout changeHeaderColor="true">
                <ProductsByCategory />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="wishlist"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <WishList />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="checkout/cart"
            element={
              <Layout changeHeaderColor="true">
                <CheckOut />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="checkout/cart/not_login"
            element={
              <Layout changeHeaderColor="true">
                <CheckOutWithoutLogin  />
              </Layout>
            }
          />
        </Routes>
        <Routes>
          <Route path="login" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="register/:id" element={<SignIn />} />
        </Routes>
        {/* <Routes>
        <Route path="verify-seller" element={<VerifySeller />} />
      </Routes> */}

        <Routes>
          <Route
            path="track-order"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <TrackOrder />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="profile"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <Profile />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="profile/invoice/:orderId"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <UserInvoicePage />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="cancel"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <CancelSection />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admincancel"
            element={
              <UserAuth>
                <Layout changeHeaderColor="true">
                  <AdminCancelSection />
                </Layout>
              </UserAuth>
            }
          />
        </Routes>

        <Routes>
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>
        <Routes>
          <Route
            path="seller"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <Admin />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/products"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <ProductList />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/products/add"


            element={
              <AdminAuth>
                <Layoutadmin>
                  <ProductAddPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/products/edit/:id"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <ProductEditPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/brands"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <BrandList />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/brands/add"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <BrandAddPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/brands/edit/:id"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <BrandEditPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/category"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <CategoryList />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/category/add"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <CategoryAddPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/category/edit/:id"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <CategoryEditPage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/users"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <UserList />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/invoice/:invoiceId"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <InvoicePage />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="seller/orders"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <OrderList />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>

        <Routes>
          <Route
            path="seller/profile"
            element={
              <AdminAuth>
                <Layoutadmin>
                  <Profile />
                </Layoutadmin>
              </AdminAuth>
            }
          />
        </Routes>

        <Routes>

          <Route
            path="admin"
            element={
              <SuperAdminAuth>
                <Dashboard />
              </SuperAdminAuth>
            }
          />

        </Routes>

        <Routes>

          <Route
            path="/advertisement"
            element={
              <SuperAdminAuth>
                <Advertisement />
              </SuperAdminAuth>

            }
          />

        </Routes>



        <Routes>
          <Route
            path="admin/vendors"
            element={
              <SuperAdminAuth>
                <Vendors />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/products"
            element={<SuperAdminAuth>
              <ProductsAdmin />
            </SuperAdminAuth>

            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/buyers"
            element={
              <SuperAdminAuth>
                <Buyers />
              </SuperAdminAuth>
            }
          />
        </Routes>


        <Routes>
          <Route
            path="admin/invoice"
            element={
              <SuperAdminAuth>
                <InvoiceAdmin />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/invoice/details/:id"
            element={
              <SuperAdminAuth>
                <InvoiceDetails />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/profile"
            element={
              <SuperAdminAuth>
                <ProfileAdmin />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/approval"
            element={
              <SuperAdminAuth>
                <Approval />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/approval/:id"
            element={
              <SuperAdminAuth>
                <ApprovalSlip />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/vendors/details/:id"
            element={
              <SuperAdminAuth>
                <Vendorsdetail />
              </SuperAdminAuth>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="admin/vendors/product_details"
            element={
              <SuperAdminAuth>
                <SellerProducts />
              </SuperAdminAuth>
            }
          />
        </Routes>

      </BrowserRouter>
    </CartProvider>


  );
}

export default App;
