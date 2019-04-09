/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Form, Input, Button, Select, Upload, Icon, message, notification } from 'antd'
import { connect } from 'react-redux'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'

const { Option } = Select

const FormItem = Form.Item
const { Dragger } = Upload

@Form.create()
@connect(({ lecture, router }) => ({ lecture, router }))
class AddLecture extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    editingBlog: '',
    editedBody: '',
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'lecture/GET_TOPICS',
    })
    dispatch({
      type: 'lecture/GET_EVENTS',
    })
    dispatch({
      type: 'lecture/GET_LOCATIONS',
    })
  }

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

  onEditorStateChange: Function = editorState => {
    this.setState({
      editorState,
    })
  }

  handleFileChange = info => {
    if (info.file.status === 'uploading') {
      console.log('uploading')
    }
    if (info.file.status === 'done') {
      this.uploads3(info.file)
    }
  }

  handleReset = () => {
    // event.preventDefault()
    const { form } = this.props
    form.resetFields()
    this.setState({
      editorState: '',
      editingBlog: {},
    })
  }

  render() {
    console.log('this.prpo=====>>>>', this.props)
    const { form, english, lecture } = this.props
    const { topics, events, locations } = lecture
    const { editingBlog, editedBody, editorState } = this.state
    const { files } = editingBlog

    return (
      <div>
        <Helmet title="Add Blog Post" />
        <section className="card">
          <div className="card-header mb-2">
            <div className="utils__title">
              <strong>Lecture Add/Edit</strong>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.addPost}>
              <Form className="mt-3" onSubmit={this.handleFormBody}>
                <div className="form-group">
                  <FormItem label={english ? 'Title_En' : 'Title_Ru'}>
                    {form.getFieldDecorator('title', {
                      initialValue: editingBlog ? editingBlog.title_en : '',
                    })(<Input placeholder="Post title" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Author">
                    {form.getFieldDecorator('author')(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Author"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="english">Niranjana Swami</Option>
                        <Option value="russian">Other</Option>
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Language">
                    {form.getFieldDecorator('language', {
                      initialValue: editingBlog ? editingBlog.language : '',
                    })(
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
                        <Option value="english">English</Option>
                        <Option value="russian">Russian</Option>
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Location">
                    {form.getFieldDecorator('location')(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Location"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {locations && locations.length > 0
                          ? locations.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Event">
                    {form.getFieldDecorator('author')(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Event"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {events && events.length > 0
                          ? events.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Topic">
                    {form.getFieldDecorator('topic')(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Topic"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {topics && topics.length > 0
                          ? topics.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="part">
                    {form.getFieldDecorator('tag', {
                      initialValue: editingBlog ? editingBlog.tags_en : '',
                    })(<Input placeholder="parts/songs" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="chapter">
                    {form.getFieldDecorator('title', {
                      initialValue: editingBlog ? editingBlog.title_en : '',
                    })(<Input placeholder="Chapter" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="varse">
                    {form.getFieldDecorator('title', {
                      initialValue: editingBlog ? editingBlog.title_en : '',
                    })(<Input placeholder="Verse/Text" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label={english ? 'Body_En' : 'Body_Ru'}>
                    {form.getFieldDecorator('content', {
                      initialValue: editorState || '',
                    })(
                      <div className={styles.editor}>
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={this.onEditorStateChange}
                        />
                      </div>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <ul>
                    {files && files.length > 0
                      ? files.map(item => {
                          return (
                            <li className="filesList">
                              {item}{' '}
                              <i
                                className="fa fa-close closeIcon"
                                onClick={() => {
                                  this.delereFile(item)
                                }}
                              />
                            </li>
                          )
                        })
                      : null}
                  </ul>
                </div>
                <div className="form-group">
                  <FormItem>
                    {form.getFieldDecorator('Files')(
                      <Dragger
                        customRequest={this.dummyRequest}
                        onChange={this.handleFileChange}
                        beforeUpload={this.beforeUpload}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload. Strictly prohibit from uploading
                          company data or other band files
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
                    <Button type="danger" onClick={this.handleReset}>
                      Discard
                    </Button>
                  </div>
                </FormItem>
              </Form>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default AddLecture
