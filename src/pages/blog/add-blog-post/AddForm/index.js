/* eslint-disable no-unused-vars */
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Form, Input, Button, Select, Upload, Icon } from 'antd'
import { connect } from 'react-redux'
import styles from '../style.module.scss'

const { Option } = Select

const FormItem = Form.Item
const { Dragger } = Upload

@Form.create()
@connect(({ blog }) => ({ blog }))
class AddForm extends React.Component {
  uuidv4 = () => {
    // eslint-disable-next-line func-names
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0

      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  handleFormBody = event => {
    event.preventDefault()
    const { form, dispatch, blog } = this.props
    const titleEn = form.getFieldValue('title')
    const tag = form.getFieldValue('tag')
    const language = form.getFieldValue('language')
    const bodyEn = form.getFieldValue('content')
    const body = {
      title_en: titleEn,
      author: 'nirajanana swami',
      body_en: bodyEn,
      needs_translation: true,
      uuid: this.uuidv4(),
    }
    dispatch({
      type: 'blog/CREATE_BLOG',
      payload: body,
    })
  }

  render() {
    const { form } = this.props

    return (
      <Form className="mt-3" onSubmit={this.handleFormBody}>
        <div className="form-group">
          <FormItem label="Title">
            {form.getFieldDecorator('title')(<Input placeholder="Post title" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Tags">
            {form.getFieldDecorator('tag')(<Input placeholder="Tags" />)}
          </FormItem>
        </div>
        <div className="form-group">
          <FormItem label="Language">
            {form.getFieldDecorator('language')(
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
