/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:40:37
 * @Last Modified by: qiuz
 */

import React, { Component } from 'react';
import './index.less';

export default class HeaderBar extends Component<any, any> {
  state = {
    icon: 'arrows-alt',
    count: 100,
    visible: false
  };

  render() {
    return (
      <div id="headerbar">
        <div style={{ lineHeight: '64px', float: 'right' }}>
          <ul className="header-ul"></ul>
        </div>
      </div>
    );
  }
}
