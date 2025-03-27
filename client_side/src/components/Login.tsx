'use client';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';

export default function Login() {
  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', values);
      message.success('Login Successful!');
      console.log('Response:', response.data);
    } catch (error) {
      message.error('Login Failed!');
      console.error('Error:', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto', padding: '20px' }}>
      <h1 style={{color: "#000000"}}>Login</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}