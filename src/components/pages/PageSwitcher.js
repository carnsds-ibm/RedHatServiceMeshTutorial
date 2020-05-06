import React from 'react';

import HomePage from './HomePage';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import SixthPage from './SixthPage';
import SeventhPage from './SeventhPage';
import EighthPage from './EighthPage';
import NinthPage from './NinthPage';

class PageSwitcher extends React.Component {
    
      renderSwitch = param => {
        switch (param) 
        {
        case 1:
          return <HomePage />
        case 2:
          return <SecondPage />
        case 3:
          return <ThirdPage />
        case 4:
            return <FourthPage />
        case 5:
            return <FifthPage />
        case 6:
            return <SixthPage />
        case 7:
            return <SeventhPage />
        case 8:
            return <EighthPage />
        case 9:
            return <NinthPage />
        default:
          return <HomePage />
        }
      }

      render() {
          return this.renderSwitch(this.props.page);
      }
}

export default PageSwitcher;
