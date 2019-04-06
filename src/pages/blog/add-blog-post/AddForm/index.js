/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Form, Input, Button, Select, Upload, Icon, message, notification } from 'antd'
import { connect } from 'react-redux'
import $ from 'jquery'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import styles from '../style.module.scss'

const { Option } = Select

const FormItem = Form.Item
const { Dragger } = Upload

@Form.create()
@connect(({ blog, router }) => ({ blog, router }))
class AddForm extends React.Component {
  state = {
    files: [],
    editorState: EditorState.createEmpty(),
    editingBlog: '',
    editedBody: '',
  }

  componentDidMount() {
    const { router, dispatch } = this.props
    const { location } = router
    const uuid = location.state
    if (uuid !== undefined) {
      const body = {
        uuid,
      }
      dispatch({
        type: 'blog/GET_BLOG_BY_ID',
        payload: body,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blog.editBlog) {
      const { blog } = nextProps
      const { editBlog } = blog
      const html = editBlog ? editBlog.body_en : ''
      let editorState = ''
      if (html.length > 0) {
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          editorState = EditorState.createWithContent(contentState)
        }
        this.setState({
          editingBlog: blog.editBlog,
          editorState,
        })
      }
    }
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

  handleFormBody = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    const { files, editorState } = this.state
    const titleEn = form.getFieldValue('title')
    const tag = form.getFieldValue('tag')
    const language = form.getFieldValue('language')
    const bodyEn = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    const body = {
      title_en: titleEn,
      author: 'nirajanana swami',
      body_en: bodyEn,
      needs_translation: true,
      uuid: this.uuidv4(),
      files,
    }
    dispatch({
      type: 'blog/CREATE_BLOG',
      payload: body,
    })
  }

  onEditorStateChange: Function = editorState => {
    this.setState({
      editorState,
    })
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  handleFileChange = info => {
    if (info.file.status === 'uploading') {
      console.log('uploading')
    }
    if (info.file.status === 'done') {
      this.uploads3(info.file)
    }
  }

  uploads3 = file => {
    const fileName = file.name
    const fileType = file.type
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/blog/generateUploadUrl?name=folder1/${fileName}&type=${fileType}`,
      success: data => {
        const temp = data.presignedUrl.toString()
        const finalUrl = temp.substr(0, temp.lastIndexOf('?'))
        const { files } = this.state
        const array = [...files]

        array.push(finalUrl)
        this.setState({ files: array })

        this.uploadFileToS3UsingPresignedUrl(data.presignedUrl, file)
      },
      error() {
        notification.error({
          message: 'error',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  uploadFileToS3UsingPresignedUrl = (presignedUrl, file) => {
    $.ajax({
      type: 'PUT',
      url: presignedUrl,
      data: file,
      headers: {
        'Content-Type': file.type,
        reportProgress: true,
      },
      processData: false,
      success: data => {
        console.log('success')
        notification.success({
          message: 'Success',
          description: 'file has been uploaded successfully',
        })
      },
      error() {
        notification.error({
          message: 'error',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  saveUploadUrl = () => {}

  beforeUpload = file => {
    const isJPG = file.type === 'image/png'
    if (!isJPG) {
      message.error('You can only upload JPG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    notification.success({
      message: 'Waiting',
      description: 'Uploading started',
    })
    return isJPG && isLt2M
  }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  delereFile = item => {
    const fileName = item.substr(item.lastIndexOf('.com/') + 5)
    console.log(fileName)
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/blog/deleteFile/?filename=${fileName}`,
      success: data => {
        notification.success({
          message: 'File Deleted',
          description: 'File has been successfully deleted',
        })
      },
      error() {
        notification.error({
          message: 'error',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  render() {
    const { form } = this.props
    const { editingBlog, editedBody, editorState } = this.state
    const { files } = editingBlog

    return (
      <Form className="mt-3" onSubmit={this.handleFormBody}>
        <div className="form-group">
          <FormItem label="Title">
            {form.getFieldDecorator('title', {
              initialValue: editingBlog ? editingBlog.title_en : '',
            })(<Input placeholder="Post title" />)}
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
            {form.getFieldDecorator('content', {
              initialValue: editorState || '',
            })(
              <div className={styles.editor}>
                <Editor editorState={editorState} onEditorStateChange={this.onEditorStateChange} />
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
