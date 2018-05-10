import React from 'react';

import { HomeComponent } from './header';
import { shallow } from 'enzyme';

describe('Composer', () => {
    it('exists', () => {
        const element = shallow(<HomeComponent />);

        expect(element.exists()).toBe(true);
    });
});
