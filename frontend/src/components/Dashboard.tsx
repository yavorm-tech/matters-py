import {FC, useState} from 'react'
import { Navbar, Button } from 'flowbite-react';
import { navbarTheme } from '../themes/navbarTheme';
import { Link } from 'react-router-dom';


export const Dashboard: FC = function () {
    const [active,setActive] = useState(false);

    return (
        <div>
            <p className="dark:text-white">Dashboard</p>
            <Link to="/deployments">Deployments</Link>
            <Link to="/commits">Commits</Link>
        </div>
      
    );
  };