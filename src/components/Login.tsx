'use client';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post('https://tresor-backend-1.onrender.com/api/users/login', values);
      message.success('Login Successful!');
      localStorage.setItem('token', res.data.token); 

      // Redirect to product page after successful login
      router.push('/product-list');
    } catch (error) {
      message.error('Login Failed!');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <Title level={2} style={{ color: "#000" }}>Login</Title>
      <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
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

        <Form.Item name="remember" valuePropName="checked" style={{textAlign: 'left'}}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log In
          </Button>
          <Button type="link" onClick={() => router.push('/signup')}>
            Don't have an account? Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}