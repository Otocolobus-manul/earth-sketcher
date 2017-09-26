'use strict';

import LeftToolbar from 'Conf/LeftToolbar'
export default {
    needsRefresh: false,
    LeftToolbarSelected: LeftToolbar.Drag,
    // When we are drawing something, we should temporary ban the button.
    buttonBanned: false,
}
