import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Form, Input, Button, Select, Upload, Icon } from 'antd'
import styles from '../style.module.scss'

const { Option } = Select

const FormItem = Form.Item
const { Dragger } = Upload

@Form.create()
class AddForm extends React.Component {
  render() {
    const { form } = this.props

    return (
      <Form className="mt-3">
        <div className="form-group">
          <FormItem label="Title">
            {form.getFieldDecorator('title')(<Input placeholder="Post title" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Tags">
            {form.getFieldDecorator('title')(<Input placeholder="Tags" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Language">
            {form.getFieldDecorator('colors')(
              <Select
                id="product-edit-colors"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a color"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="blue">English</Option>
                <Option value="red">Russian</Option>
              </Select>,
            )}
          </FormItem>
        </div>

        <div className="form-group">
          <FormItem label="Body">
            {form.getFieldDecorator('content')(
              <div className={styles.editor}>
                <Editor />
              </div>,
            )}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem>
            {form.getFieldDecorator('Files')(
              <Dragger>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data
                  or other band files
                </p>
              </Dragger>,
            )}
          </FormItem>
        </div>
        <FormItem>
          <div className={styles.submit}>
            <span className="mr-3">
              <Button type="primary" htmlType="submit">
                Save and Post
              </Button>
            </span>
            <Button type="danger" htmlType="submit">
              Discard
            </Button>
          </div>
        </FormItem>
      </Form>
    )
  }
}

export default AddForm
