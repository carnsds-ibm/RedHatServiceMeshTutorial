import React from 'react';
import './App.css';
import './app.scss';
import AppHeader from './components/header/AppHeader';
import { SideNav, SideNavLink } from 'carbon-components-react/es/components/UIShell';
import { Button } from 'carbon-components-react';
import PageSwitcher from './components/pages/PageSwitcher';
import { Content } from "carbon-components-react/lib/components/UIShell";

class App extends React.Component {

  state = {
    view: 1,
    prev: true,
    next: false
  }

  changePage = ({page}) => {
    let prev = false, next = false;
    if (page <= 1) {
      page = 1;
      prev = true;
    }
    if (page >= 9) {
      page = 9;
      next = true;
    }
    this.setState({
      view: page,
      prev,
      next
    });
    window.scrollTo(0, 0);
  }

  render() {

    const Fade16 = () => (
      <svg
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12 12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86 23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14 14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
      </svg>
    );

    return (
      <div className="container">
        <AppHeader />
        <SideNav
          isFixedNav
          expanded={true}
          isChildOfHeader={false}
          aria-label="Side navigation"
        >
          <SideNavLink onClick={() => this.changePage({page: 1})} renderIcon={Fade16}>Welcome</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 2})} renderIcon={Fade16}>Setup</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 3})} renderIcon={Fade16}>Configuration</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 4})} renderIcon={Fade16}>Installation</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 5})} renderIcon={Fade16}>Using Kiali</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 6})} renderIcon={Fade16}>Grafana</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 7})} renderIcon={Fade16}>Distributed Tracing</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 8})} renderIcon={Fade16}>Egress</SideNavLink>
          <SideNavLink onClick={() => this.changePage({page: 9})} renderIcon={Fade16}>Contact</SideNavLink>

        </SideNav>
        <PageSwitcher page={this.state.view} />
        <Content style={({marginTop: '-10px'})} className='custom_button'>
          <Button style={({ marginRight: '0.3rem' })} id='prev_button' kind='primary' disabled={this.state.prev} onClick={() => this.changePage({page: this.state.view-1})}>Previous</Button>
          <Button style={({ marginLeft: '0.3rem' })} id='next_button' kind='primary' disabled={this.state.next} onClick={() => this.changePage({page: this.state.view+1})}>Next</Button>
        </Content>
      </div>
    );
  }
}

export default App;
