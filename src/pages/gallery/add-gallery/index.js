/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import { DatePicker, Form, Input, Select, Upload, Icon, notification, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import $ from 'jquery'
import moment from 'moment'

import styles from './style.module.scss'

const FormItem = Form.Item
const { Option } = Select
const { Dragger } = Upload

@Form.create()
@connect(({ gallery, router }) => ({ gallery, router }))
class CreateGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photoFiles: [],
      galleryBody: EditorState.createEmpty(),
      createDate: '',
      publishDate: '',
      gallery: '2019',
      editGallery: '',
    }
  }

  componentDidMount() {
    const { dispatch, router } = this.props
    const { location } = router
    const uuid = location.state
    dispatch({
      type: 'gallery/GET_GALLERY_LIST',
    })
    if (uuid !== undefined) {
      const body = {
        uuid,
      }
      dispatch({
        type: 'gallery/GET_GALLERY_BY_ID',
        payload: body,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gallery.editGallery !== '') {
      const { gallery } = nextProps
      const { editGallery } = gallery
      this.setState({
        editGallery,
        gallery: editGallery.gallery,
        photoFiles: editGallery.photos,
      })
    }
    if (nextProps.gallery.isGalleryCreated) {
      this.handleReset()
    }
  }

  onEditorStateChange: Function = editorState => {
    this.setState({
      galleryBody: editorState,
    })
  }

  hadleSelectGallery = gallery => {
    this.setState({ gallery })
  }

  beforeUploadAudio = file => {
    const isJPG = file.type === 'image/jpg' || 'image/png' || 'image/jpeg'
    if (!isJPG) {
      notification.error({
        message: 'error',
        description: 'You can only upload image file!',
      })
    }
    return isJPG
  }

  dummyRequest = ({ file, onSuccess }) => {
    console.log(file)
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  handleFileChange = info => {
    this.handleUploading(info)
  }

  handleUploading = info => {
    console.log('info.file.type=====>>>>', info.file.type)
    if (info.file.status === 'uploading') {
      notification.success({
        message: 'Uploading Started',
        description: 'File uploading is started',
      })
    }
    if (info.file.status === 'done') {
      this.uploads3(info.file)
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

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
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
        this.setUploadedFiles(finalUrl)
        this.uploadFileToS3UsingPresignedUrl(data.presignedUrl, file)
      },
      error() {
        notification.error({
          message: 'Error',
          description: 'Error occured during uploading, try again',
        })
      },
    })
  }

  uploadFileToS3UsingPresignedUrl = (presignedUrl, file) => {
    $.ajax({
      type: 'PUT',
      url: presignedUrl,
      data: file.originFileObj,
      headers: {
        'Content-Type': file.type,
        reportProgress: true,
      },
      processData: false,
      success: () => {
        notification.success({
          message: 'Success',
          description: 'file has been uploaded successfully',
        })
      },
      error() {
        notification.warning({
          message: 'error',
          description: 'Error occured during uploading, try again',
        })
      },
    })
  }

  setUploadedFiles = finalUrl => {
    const { photoFiles } = this.state

    const array = [...photoFiles]
    array.push(finalUrl)
    this.setState({
      photoFiles: array,
    })
  }

  handleCreateDate = (date, dateString) => {
    console.log(date, dateString)
    this.setState({
      createDate: dateString,
    })
  }

  handlePublishDate = (date, dateString) => {
    console.log(date, dateString)
    this.setState({
      publishDate: dateString,
    })
  }

  handleFormBody = event => {
    event.preventDefault()
    const { form, dispatch, router } = this.props
    const { location } = router
    const uuid = location.state
    const { photoFiles, galleryBody, gallery, createDate, publishDate, editGallery } = this.state
    const titleEn = form.getFieldValue('title')
    const bodyEn = draftToHtml(convertToRaw(galleryBody.getCurrentContent()))

    const body = {
      uuid: uuid || this.uuidv4(),
      title: titleEn,
      gallery,
      date: createDate,
      publish_date: publishDate,
      photos: photoFiles,
      body: bodyEn,
    }
    if (editGallery !== '') {
      const payload = {
        body,
        uuid,
      }
      dispatch({
        type: 'gallery/UPDATE_GALLERY',
        payload,
      })
    } else {
      dispatch({
        type: 'gallery/CREATE_GALLERY',
        body,
      })
    }
  }

  deleteFile = item => {
    const fileName = item.substr(item.lastIndexOf('.com/') + 5)
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/blog/deleteFile/?filename=${fileName}`,
      success: () => {
        notification.success({
          message: 'File Deleted',
          description: 'File has been successfully deleted',
        })
        this.handelDeleteSetFiles(item)
      },
      error() {
        notification.error({
          message: 'error',
          description: 'Error occured during uploading, try again',
        })
      },
    })
  }

  handelDeleteSetFiles = item => {
    const { photoFiles } = this.state

    for (let i = 0; i < photoFiles.length; i += 1) {
      if (photoFiles[i] === item) {
        photoFiles.splice(i, 1)
        break
      }
    }
    this.setState({
      photoFiles,
    })
  }

  handleReset = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      photoFiles: [],
      galleryBody: EditorState.createEmpty(),
      createDate: '',
      publishDate: '',
    })
  }

  render() {
    const { form, gallery } = this.props
    const { mainGallery } = gallery
    const dateFormat = 'YYYY/MM/DD'

    const { galleryBody, photoFiles, editGallery } = this.state
    return (
      <div>
        <Helmet title="Create Gallery" />
        <section className="card">
          <div className="card-header mb-2">
            <div className="utils__title">
              <strong>Create Gallery</strong>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.addPost}>
              <Form className="mt-3">
                <div className="form-group">
                  <FormItem label="Title">
                    {form.getFieldDecorator('title', {
                      initialValue: editGallery ? editGallery.title : '',
                    })(<Input placeholder="Enter Title" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Body">
                    {form.getFieldDecorator('content')(
                      <div className={styles.editor}>
                        <Editor
                          editorState={galleryBody}
                          onEditorStateChange={this.onEditorStateChange}
                        />
                      </div>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Gallery">
                    <Select
                      id="gallery-item"
                      defaultValue="2019"
                      showSearch
                      style={{ width: '25%' }}
                      onChange={this.hadleSelectGallery}
                      placeholder="Select Gallery"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {mainGallery && mainGallery.length > 0
                        ? mainGallery.map(item => {
                            return <Option value={item}>{item}</Option>
                          })
                        : null}
                    </Select>
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Created Date">
                    {form.getFieldDecorator('create_date', {
                      initialValue: editGallery ? moment(editGallery.date, dateFormat) : '',
                    })(<DatePicker onChange={this.handleCreateDate} />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Published Date">
                    {form.getFieldDecorator('publish_date', {
                      initialValue: editGallery ? moment(editGallery.publish_date, dateFormat) : '',
                    })(<DatePicker onChange={this.handlePublishDate} />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Uploaded Photos">
                    <ul>
                      {photoFiles && photoFiles.length > 0
                        ? photoFiles.map(item => {
                            if (item !== '') {
                              return (
                                <li className="filesList">
                                  {item} &nbsp;&nbsp;
                                  <i
                                    className="fa fa-close closeIcon"
                                    onClick={() => {
                                      this.deleteFile(item)
                                    }}
                                  />
                                </li>
                              )
                            }
                          })
                        : null}
                    </ul>
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Upload Photos">
                    {form.getFieldDecorator('Files')(
                      <Dragger
                        beforeUpload={this.beforeUploadAudio}
                        multiple={false}
                        showUploadList={false}
                        customRequest={this.dummyRequest}
                        onChange={this.handleFileChange}
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
              </Form>
            </div>
            <div className={styles.submit}>
              <span className="mr-3">
                <Button type="primary" onClick={this.handleFormBody}>
                  Save and Post
                </Button>
              </span>
              <Button type="danger" onClick={this.handleReset}>
                Discard
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default CreateGallery
