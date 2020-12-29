import { createStackNavigator } from 'react-navigation-stack';
import Catalogue from '../screens/Catalogue';
import ShirtCatalogue from '../screens/Catalogue1';
import PantCatalgue from '../screens/PantCatalogue';
import Catalogue2 from '../screens/ShirtCatalogue';
import LogIn from '../screens/LogIn';
import WatchCatalogue from '../screens/WatchCatalogue';
import TieCatalogue from '../screens/TieCatalogue';
import SportCatalogue from '../screens/SportCatalogue';
import FormalCatalogue from '../screens/FormalCatalogue';
import Cart from '../screens/Cart';
import City from '../screens/City';
import DateScreen from '../screens/Date';
import MyOrder from '../screens/MyOrder'
import Profile from '../screens/Profile';

export const StackNavigator = createStackNavigator({
    LogIn:{
        screen:LogIn,
        navigationOptions:{
            title:"Welcome"
        }
    },
    City:{
        screen:City,
        navigationOptions:{
            headerShown:false
        }
    },
    Date:{
        screen:DateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    Catalogue:{
        screen:Catalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    Catalogue1:{
        screen:ShirtCatalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    ShirtCatalogue:{
        screen:Catalogue2,
        navigationOptions:{
            headerShown:false
        }
    },
    PantCatalogue:{
        screen:PantCatalgue,
        navigationOptions:{
            headerShown:false
        }
    },
    WatchCatalogue:{
        screen:WatchCatalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    TieCatalogue:{
        screen:TieCatalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    SportCatalogue:{
        screen:SportCatalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    FormalCatalogue:{
        screen:FormalCatalogue,
        navigationOptions:{
            headerShown:false
        }
    },
    Cart:{
        screen:Cart,
        navigationOptions:{
            title:"Cart"
        }
    }
}
)