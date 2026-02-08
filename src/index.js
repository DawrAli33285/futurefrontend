import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout';
import ChartCalculator from './chartcalculator';
import AstrologyReport from './fullreport';
import SiderealChartPage from './chartreport';
import FAQPage from './faq';
import TeamPage from './teams';
import MemberBioPage from './member';
import LearnChartPage from './learnchart';
import CoursesPage from './course';
import Readings from './readings';
import ContactPage from './contact';
import NewsletterPage from './newsletter';
import JoinNewsletterPage from './joinnewsletter';
import HoroscopePage from './weeklyhoroscope';
import SiderealAstrologyPage from './siderealastrology';
import MediaAppearancesPage from './appearance';
import TrueSkyLanding from './software';
import SiderealSignCalculator from './sideralsigns';
import AdminLayout from './components/adminlayout';
import AdminSettings from './adminsettings';
import AdminChat from './adminchat';
import AdminDocs from './admindocs';
import AdminProfilePage from './adminaccount';
import AdminChart from './adminmainchart';
import AdminMain from './adminmain';
import TransitPage from './transitpage';
import SynastryPage from './synastrypage';
import CompositePage from './composite';
import TransitGraphPage from "./transitgraphpage"
import BirthdateModal from './components/birthdate';
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import SacredPage from './sacred';
import OphiuchusInAstrology from './ophichus';

//const stripePromise = loadStripe('pk_live_51SOf9PF2ZpC0D5XRyQ0zxZt7dD1NjS35N96b4MbZVnzdl2LbrUNi23MUsm2ubgkw91R1dVcplSxLOXivDZf9EhkN005twLIZcj');
const stripePromise = loadStripe('pk_test_51SOf9XJvg5goDQYJPE0RiLj0MkFU8S3RQpQd3nPEDjD4W8nmXNv3RDkFcsmhN5Mg9k4uQOuLhR3AAvkX4IeecPfN00b7KHAY7s');



const AdminWithBirthdateModal = ({ element }) => (
  <>
    <BirthdateModal />
    {element}
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/about', element: <App /> },
      { path: '/charts', element: <App /> },
      { path: '/learn', element: <App /> },
      {path:'/readings',element:<Readings/>},
      { path: '/software', element: <TrueSkyLanding /> },
      { path: '/more', element: <App /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/true-signs', element: <App /> },
      { path: '/sidereal-astrology', element: <App /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/team', element: <TeamPage /> },
      {path:'/sacred',element:<SacredPage/>},
      { path: '/team/:name', element: <MemberBioPage /> },
      { path: '/terms', element: <App /> },
      { path: '/free-report', element: <App /> },
      { path: '/newsletter', element: <NewsletterPage /> },
      { path: '/partner', element: <App /> },
      { path: '/chart-calculator', element: <ChartCalculator /> },
      { path: '/chart-report', element: <SiderealChartPage /> },
      { path: '/full-report', element: <AstrologyReport /> },
      { path: '/chart-dictionary', element: <LearnChartPage /> },
      { path:'/chart-course', element: <CoursesPage />},
      { path:'/horoscope', element: <HoroscopePage />},
      { path:'/joinnewsletter', element: <JoinNewsletterPage />},
      { path:'/appearance', element: <MediaAppearancesPage />},
      { path:'/siderealastrology', element: <SiderealAstrologyPage />},
      {path:'/sidereal-signs',element:<SiderealSignCalculator/>},
      {path:'/ophiuchus-in-astrology',element:<OphiuchusInAstrology/>},
      
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '/admin/main', element: <AdminWithBirthdateModal element={<AdminMain />} /> },
      { path: '/admin/transit', element: <AdminWithBirthdateModal element={<TransitPage />} /> },
      { path: '/admin/graph', element: <AdminWithBirthdateModal element={<TransitGraphPage />} /> },
      { path: '/admin/return', element: <AdminWithBirthdateModal element={<AdminMain />} /> },
      { path: '/admin/settings', element: <AdminWithBirthdateModal element={<AdminSettings />} /> },
      { path: '/admin/synastry', element: <AdminWithBirthdateModal element={<SynastryPage />} /> },
      { path: '/admin/composite', element: <AdminWithBirthdateModal element={<CompositePage />} /> },
      { path: '/admin/chat', element: <AdminWithBirthdateModal element={<AdminChat />} /> },
      { path: '/admin/docs', element: <AdminWithBirthdateModal element={<AdminDocs />} /> },
      { path: '/admin/account', element: <AdminWithBirthdateModal element={<AdminProfilePage />} /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Elements stripe={stripePromise}>
   <RouterProvider router={router} />
   </Elements>
  </React.StrictMode>
);

reportWebVitals();