// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const SidebarConfiAdManager = [
  {
    title: 'Dashboard',
    path: '/dashboard/home',
    icon: getIcon('eva:pie-chart-2-fill')
  },

  {
    title: 'Assets',
    path: '/dashboard/asset',
    icon: getIcon('eva:people-fill')
  },


];

export default SidebarConfiAdManager;
