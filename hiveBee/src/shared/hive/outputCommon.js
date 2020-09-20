import React, { Component } from 'react';
import { Descriptions } from 'antd';
import { Card } from 'antd';

class OutputCommon extends Component {

    render() { /*displaying all details regarding the application */
        return (
            <React.Fragment>
                <Card>
                    <Descriptions title="Application Information">
                        <Descriptions.Item label="Application type">Hive</Descriptions.Item>
                        <Descriptions.Item label="Cluster ID">{this.props.cluster_id}</Descriptions.Item>
                        <Descriptions.Item label="keyword searched">{this.props.keyword}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions>
                        <Descriptions.Item label="Query ID">{this.props.query_id}</Descriptions.Item>
                        <Descriptions.Item label="Application ID">{this.props.application_id}</Descriptions.Item>
                        <Descriptions.Item label="Total containers">{this.props.data.length}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions>
                        <Descriptions.Item label="Query logs path">{this.props.query_path}</Descriptions.Item>
                    </Descriptions>

                </Card>
            </React.Fragment>

        );
    }
}

export default OutputCommon;
