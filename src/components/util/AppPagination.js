import React from 'react';
import 'carbon-components/css/carbon-components.min.css';
import { Pagination } from 'carbon-components-react';
import { Content } from "carbon-components-react/lib/components/UIShell";

class AppPagination extends React.Component {
    render() {        return (
            <Content>
                <Pagination 
                    onChange={this.props.onClick}
                    backwardText="Previous"
                    forwardText="Next"
                    itemsPerPageText={null}
                    page={1}
                    pageNumberText="Page Number"
                    pageSize={1}
                    pageSizes={[
                    1,
                    ]}
                    totalItems={9}
                />
            </Content>
        );
    }
}

export default AppPagination;