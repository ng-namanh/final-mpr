import * as React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert, ScrollView, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Form, FormField, FormInput } from '~/components/ui/form'
import { Text } from '~/components/ui/text'
import { Link, useRouter } from 'expo-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
})

export default function FormScreen() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      if (response) {
        router.push('/')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View className='p-6 mx-auto w-full max-w-xl justify-center flex-1'>
      <View className='mb-10'>
        <Text className='text-2xl font-semibold'>Login</Text>
        <Text> Enter your email below to login to your account</Text>
      </View>
      <Form {...form}>
        <View className='gap-7 mt-10'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormInput
                label='Email'
                placeholder='hello@zachnugent.ca'
                description='This will not be shared.'
                autoCapitalize='none'
                autoComplete='email'
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormInput
                label='Password'
                placeholder='********'
                description='Use a secure password.'
                secureTextEntry
                autoComplete='password'
                {...field}
              />
            )}
          />
          <Button onPress={form.handleSubmit(onSubmit)}>
            <Text>Submit</Text>
          </Button>
          <View>
            <Button
              variant='ghost'
              onPress={() => {
                form.clearErrors()
              }}
            >
              <Text>Clear errors</Text>
            </Button>
            <Button
              variant='ghost'
              onPress={() => {
                form.reset()
              }}
            >
              <Text>Clear form values</Text>
            </Button>
          </View>
          <View className='mt-4 text-center text-sm'>
            <Text>
              {' '}
              Dont have an account?{' '}
              <Link href='/auth/register' asChild>
                <Text className='text-blue-700'>Register</Text>
              </Link>{' '}
            </Text>
          </View>
        </View>
      </Form>
    </View>
  )
}
