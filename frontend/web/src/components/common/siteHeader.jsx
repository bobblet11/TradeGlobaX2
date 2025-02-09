import { useLocation } from "react-router-dom"; // Import useLocation
import HeaderProfile from "./headerProfile";
import "./siteHeader.css"
export default function SiteHeader(){
	const excludePaths = ["/login", "/register"];
	const location = useLocation(); // Get the current location
	return (
		<div className="site-header-container">
			<div>
				<h1>TradeGlobaX</h1>
			</div>

			{/* Conditionally render HeaderProfile */}
			{!excludePaths.includes(location.pathname) && <HeaderProfile />}
		</div>
	);
}