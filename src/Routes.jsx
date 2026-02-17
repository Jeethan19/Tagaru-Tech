import LiveStockInfo from "./pages/LiveStockInfo";
import LiveStockTable from "./pages/liveStockTable";
import GeoFencing from "./pages/GeoFencing";
import FarmDetails from "./pages/FarmDetails";

export const Routes = [{
    path: "/:liveStockId",
    element: <LiveStockInfo />
}, {
    path: "/",
    element: <LiveStockTable />,
},{
    path: "/farmdetails",
    element: <FarmDetails />
}, {
    path: "/geofencing",
    element: <GeoFencing />,
}]