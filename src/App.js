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
import CancellationManagementPage from "./pages/returnedorders/index.jsx";
import SellerPayout from "./pages/sellerpayout/index.jsx";
import ProductReview from "./pages/newproduct/index.jsx";
import OrderDetails from "./pages/track-order/index.jsx";
import CouponList from "./pages/coupon/index.jsx";
import SellerCoupons from "./pages/sellercoupons/index.jsx";
import AdminManagement from "./pages/adminsmanagement/addadmin/index.jsx";
import OrderTracking from "./pages/trackorderstatus/index.jsx";

import ScrollToTop from "./components/scrolltop/index.jsx";
import SellerPayoutDetail from "./pages/sellerpayoutdetail/index.jsx";
import SellerPayoutsList from "./pages/sellerproductlist/index.jsx";
import CouponManagement from "./pages/coupon/index.jsx";
import ResetPasswordPage from "./pages/confimresetpassword/index.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/test" element={<Layout><ProductReview /></Layout>} />
          <Route path="/carousel" element={<Layout><ProductsCarousel /></Layout>} />
          <Route path="/store_product/:id" element={<Layout><StoreAndProducts /></Layout>} />
          <Route path="/resetPassword/:id" element={<Layout><ResetPasswordPage /></Layout>} />
          <Route path="/privacy_policy" element={<Layout><Privacypolicy /></Layout>} />
          <Route path="/returnpolicy" element={<Layout><Returnpolicy /></Layout>} />
          <Route path="/shopping_policies" element={<Layout><ShippingInfo /></Layout>} />
          <Route path="/cancellation_refund" element={<Layout><CancellationAndRefundPolicies /></Layout>} />
          <Route path="/contact_us" element={<Layout><ContactUs /></Layout>} />
          <Route path="/termsandconditions" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/product-details/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="men-collection" element={<Layout><NewMenCollection /></Layout>} />
          <Route path="men-collection/:id" element={<Layout><NewMenCollection /></Layout>} />
          <Route path="women-collection" element={<Layout><WomenCollection /></Layout>} />
          <Route path="kids-collection" element={<Layout><KidsCollection /></Layout>} />
          <Route path="/category_search/:id" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/category_search/:id/:category" element={<Layout><CategoryPage /></Layout>} />
          <Route path="collections" element={<Layout changeHeaderColor="true"><Collections /></Layout>} />
          <Route path="appliances" element={<Layout changeHeaderColor="true"><GroceriesHomeApplianceCollection /></Layout>} />
          <Route path="search/result" element={<Layout changeHeaderColor="true"><Search /></Layout>} />
          <Route path="products_by_brand&seller" element={<Layout><StoreAndProducts /></Layout>} />
          <Route path="trending_products" element={<Layout changeHeaderColor="true"><TrendingProducts /></Layout>} />
          <Route path="add_coupons" element={<Layout changeHeaderColor="true"><CouponManagement /></Layout>} />
          <Route path="seller/coupon" element={<Layout changeHeaderColor="true"><SellerCoupons /></Layout>} />
          <Route path="/products_category/:id" element={<Layout><ProductsByCategory /></Layout>} />
          <Route path="login" element={<Login />} />
          <Route path="register/:id" element={<SignIn />} />

          {/* Authenticated User Routes */}
          <Route element={<UserAuth />}>
            <Route path="wishlist" element={<Layout changeHeaderColor="true"><WishList /></Layout>} />
            <Route path="/order_details/:id" element={<Layout changeHeaderColor="true"><OrderDetails /></Layout>} />
            <Route path="profile" element={<Layout changeHeaderColor="true"><Profile /></Layout>} />
            <Route path="profile/invoice/:orderId" element={<Layout changeHeaderColor="true"><UserInvoicePage /></Layout>} />
            <Route path="cancel" element={<Layout changeHeaderColor="true"><CancelSection /></Layout>} />
            <Route path="admincancel" element={<Layout changeHeaderColor="true"><AdminCancelSection /></Layout>} />
          </Route>

          {/* Admin/Seller Routes */}
          <Route element={<AdminAuth />}>
            <Route path="/seller" element={<Layoutadmin><Admin /></Layoutadmin>} />
            <Route path="seller/products" element={<Layoutadmin><ProductList /></Layoutadmin>} />
            <Route path="seller/products/add" element={<Layoutadmin><ProductAddPage /></Layoutadmin>} />
            <Route path="seller/products/edit/:id" element={<Layoutadmin><ProductEditPage /></Layoutadmin>} />
            <Route path="seller/brands" element={<Layoutadmin><BrandList /></Layoutadmin>} />
            <Route path="cancelled_orders" element={<Layoutadmin><CancellationManagementPage /></Layoutadmin>} />
            <Route path="seller/brands/add" element={<Layoutadmin><BrandAddPage /></Layoutadmin>} />
            <Route path="seller/brands/edit/:id" element={<Layoutadmin><BrandEditPage /></Layoutadmin>} />
            <Route path="seller/category" element={<Layoutadmin><CategoryList /></Layoutadmin>} />
            <Route path="seller/category/add" element={<Layoutadmin><CategoryAddPage /></Layoutadmin>} />
            <Route path="seller/category/edit/:id" element={<Layoutadmin><CategoryEditPage /></Layoutadmin>} />
            <Route path="seller/users" element={<Layoutadmin><UserList /></Layoutadmin>} />
            <Route path="seller/invoice/:invoiceId" element={<Layoutadmin><InvoicePage /></Layoutadmin>} />
            <Route path="seller/orders" element={<Layoutadmin><OrderList /></Layoutadmin>} />
            <Route path="seller/profile" element={<Layoutadmin><Profile /></Layoutadmin>} />
          </Route>

          {/* Super Admin Routes */}
          <Route element={<SuperAdminAuth />}>
            <Route path="admin" element={<Dashboard />} />
            <Route path="/advertisement" element={<Advertisement />} />
            <Route path="admin/vendors" element={<Vendors />} />
            <Route path="manage_admin" element={<AdminManagement />} />
            <Route path="admin/products" element={<ProductsAdmin />} />
            <Route path="admin/buyers" element={<Buyers />} />
            <Route path="admin/invoice" element={<InvoiceAdmin />} />
            <Route path="seller_payouts" element={<SellerPayout />} />
            <Route path="seller_payouts_details" element={<SellerPayoutDetail />} />
            <Route path="/sellers_products/:id" element={<SellerPayoutsList />} />
            <Route path="admin/invoice/details/:id" element={<InvoiceDetails />} />
            <Route path="admin/profile" element={<ProfileAdmin />} />
            <Route path="admin/approval" element={<Approval />} />
            <Route path="admin/approval/:id" element={<ApprovalSlip />} />
            <Route path="admin/vendors/details/:id" element={<Vendorsdetail />} />
            <Route path="admin/vendors/product_details/:id" element={<SellerProducts />} />
          </Route>

          {/* Checkout Routes */}
          <Route path="checkout/cart" element={<Layout changeHeaderColor="true"><CheckOut /></Layout>} />
          <Route path="checkout/cart/not_login" element={<Layout changeHeaderColor="true"><CheckOutWithoutLogin /></Layout>} />
          <Route path="/tracking_order/:id/:id" element={<Layout changeHeaderColor="true"><OrderTracking /></Layout>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>

  );
}

export default App;
