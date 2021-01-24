/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Row, Col, Spin } from 'antd';
import './index.less';

import { registerMicroApps, start, initGlobalState, runAfterFirstMounted } from 'qiankun';
import { HeaderBar, CustomMenuLeft, findMenuPath } from 'components';

import { MENU_LIST } from './mock';

const { Header, Sider, Content, Footer } = Layout;

const LAST_SELECTED_MENU = 'last_selected_menu';

export default class AdminHome extends Component<any, any> {
  constructor(props: any) {
    super(props);
    const selectedMenu = localStorage.getItem(LAST_SELECTED_MENU);
    this.state = {
      current: selectedMenu ?? '47',
      loading: false,
      collapsed: false,
      subLoader: null,
      menu: [],
      currentMenuPaths: []
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  genActiveRule = (routerPrefix: string) => {
    return (location: any) => location.pathname.startsWith(routerPrefix);
  };

  componentDidMount() {
    const loader = (loading: any) => {
      const container = document.getElementById('subapp-container');
      ReactDOM.render(
        <Spin
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%'
          }}
          spinning={loading}
        />,
        container
      );
    };
    this.setState({
      loading: true,
      subLoader: loader
    });

    registerMicroApps(
      [
        {
          name: 'subapp',
          entry: `//${window.location.host}/react-image-map`,
          container: '#subapp-viewport',
          loader,
          activeRule: '/widget/react-image-map'
        }
      ],
      {
        beforeLoad: [
          (app: any) =>
            new Promise((resolve, reject) => {
              console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
              resolve(app.name);
            })
        ],
        beforeMount: [
          (app) =>
            new Promise((resolve, reject) => {
              console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
              resolve(app.name);
            })
        ],
        afterUnmount: [
          (app) =>
            new Promise((resolve, reject) => {
              console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
              resolve(app.name);
            })
        ]
      }
    );
    const { onGlobalStateChange, setGlobalState } = initGlobalState({
      user: 'qiankun'
    });

    onGlobalStateChange((value, prev) =>
      console.log('[onGlobalStateChange - master]:', value, prev)
    );

    setGlobalState({
      ignore: 'master',
      user: {
        name: 'master'
      }
    });

    /**
     * Step4 启动应用
     */
    start();
    this.getMenuQuery();
    runAfterFirstMounted(() => {
      console.log('[MainApp] first app mounted');
    });
  }

  handleClick = (e: any) => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };

  getSubTree = (): [] | null => {
    const key = this.state.current;
    let children = null;
    this.state.menu.forEach((value: any) => {
      if (value.key === key) {
        children = value.children;
      }
    });
    return children;
  };

  getMenuQuery = () => {
    console.log('执行');
    // 暂时MOCK
    const menu: any = MENU_LIST;
    this.setState({
      menu: this.filterVisibleMenu(menu)
    });
    if (this.state.current) {
      this.handleMenuChange(findMenuPath(menu, this.state.current));
    }
  };

  filterVisibleMenu = (menus: any[]) => {
    const ret = [];
    for (const item of menus) {
      if ([2, 3].includes(item.authority_type)) {
        continue;
      }
      ret.push(item);
      if (item.children) {
        item.children = this.filterVisibleMenu(item.children);
      }
    }
    return ret;
  };

  handleMenuChange = (menuPaths: any[]) => {
    this.setState({ currentMenuPaths: menuPaths });
    if (menuPaths.length) {
      localStorage.setItem(LAST_SELECTED_MENU, menuPaths[menuPaths.length - 1].key);
    }
  };

  render() {
    const { menu, current, subLoader } = this.state;
    const subTree = this.getSubTree();
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo">Widgets</div>
            <Row justify="space-around">
              <Col xs={{ span: 20 }} lg={{ span: 20 }}></Col>
              <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                <HeaderBar />
              </Col>
            </Row>
          </Header>
          <Layout style={{ marginTop: 64 }}>
            <Sider
              width={200}
              className="site-layout-background"
              collapsed={this.state.collapsed}
              onCollapse={this.state.collapsed}
            >
              <CustomMenuLeft
                menus={menu}
                current={this.state.current}
                onMenuChange={this.handleMenuChange}
              />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                {this.state.currentMenuPaths.map((item: any) => {
                  return <Breadcrumb.Item key={item.id}>{item.title}</Breadcrumb.Item>;
                })}
              </Breadcrumb>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0
                }}
              >
                <div id="subapp-container" className="view"></div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Widgets ©2021 Created by qiuz</Footer>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}
