// ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
// import { AuthContext } from './AuthContext';
// import { AuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
    // const { isAuthenticated } = useContext(AuthContext);

    return (
        <>jdf</>
        // <Route
            // {...rest}
            // render={props =>
            //     isAuthenticated ? (
                    // <Component {} />
            //     ) : (
            //         <Redirect to="/login" />
            //     )
            // }
        // />
    );
};

export default ProtectedRoute;
