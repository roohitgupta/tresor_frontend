'use client';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function SignUp() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post('http://localhost:8800/api/users/register', values);
      message.success(res.data.message);

      // Redirect to login page after successful registration
      router.push('/login');
    } catch (error) {
      message.error('Sign Up Failed!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <Title level={2} style={{ color: "#000" }}>Sign Up</Title>
      <Form name="signup" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

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

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item name="agreement" valuePropName="checked">
          <Checkbox style={{textAlign: 'left'}}>
            I have read the <a href="#">agreement</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign Up
          </Button>
          <Button type="link" onClick={() => router.push('/login')}>
            Already have an account? Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}