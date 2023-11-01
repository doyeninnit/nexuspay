// utils/fontawesome.ts

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";  // This imports the CSS for the icons
config.autoAddCss = false;  // Tell FontAwesome to skip adding the CSS automatically since it's being imported above

library.add(faCcVisa, faCcMastercard);  // Add any other icons you may need
