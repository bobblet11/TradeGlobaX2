import { useAuth } from "../../contexts/authProvider";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "../../contexts/navProvider";

export default function HeaderProfile() {
	const { user } = useAuth(); // Destructure user from auth context
	const {navigate} = useNavigation();

	const goToLogin = () => {
		navigate("/login")
	}

	
	const goToUserPage = () => {
		navigate("/user")
	}



	if (user) {
	return (
		<div>	
			<button>
				<FontAwesomeIcon icon={faUser} onClick={goToUserPage}/>
			</button>
		</div>
	);
	} else {
	return (
		<div>
			<button onClick={goToLogin}>
				Login
			</button>
		</div>
	);
	}
};
