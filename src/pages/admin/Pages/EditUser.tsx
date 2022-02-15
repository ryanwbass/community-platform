import type { IUserPPDB } from 'src/models'
import { FunctionComponent, useEffect, useState } from 'react'
import { useDB } from 'src/App'
import { Button } from 'src/components/Button'
import { Field, Form } from 'react-final-form'
import { Flex } from 'src/components/Flex'
import { InputField } from 'src/components/Form/Fields'
import { Label } from 'src/pages/Settings/content/formSections/elements'
import {functions} from 'src/utils/firebase'
import theme from 'src/themes/styled.theme'

import { isModuleSupported, MODULE } from 'src/modules'
import { FocusSection } from 'src/pages/Settings/content/formSections/Focus.section'
import Heading from 'src/components/Heading'
import { Box } from 'rebass/styled-components'
import { logger } from 'workbox-core/_private'

export const EditUser: FunctionComponent = (props: any) => {
  const [user, setUser] = useState({} as IUserPPDB)
  const [userEmail, setUserEmail] = useState(null);

  const { db } = useDB()
  const username = props?.match.params.username

  // Get user by slug
  useEffect(() => {
    ;(async () => {
      const collection = db.collection('users')
      const [foundUser]: any = await collection.getWhere('userName', '==', username)
      logger.debug(`EditUser.fetchUser:`, {foundUser, username})

      if (!foundUser) {
        logger.warn('Unable to find user with requested user:', {username})
        return;
      }

      setUser(foundUser as IUserPPDB);

      try {
        logger.debug(`EditUser.fetchUserEmailAddress`, {authId: foundUser._authID})
        const res = await functions.httpsCallable('adminGetUserEmail')({
          uid: foundUser && foundUser._authID,
        })
        setUserEmail(res.data);
      } catch (error) {
        logger.error('Unable to get user email', {foundUserAuthId: foundUser._authID})
        return `unable to get user email - ${error.message}`
      }

    })()
    return () => {}
  }, [])

  if (!user) {
    return <>Loading…</>
  }

  // Update user
  return (
    <>
        <Flex
            width={[1, 1, 2 / 3]}
            sx={{
                my: 4,
                bg: 'inherit',
                px: 2,
            }}>
            <Box>
            <Flex
                          card
                          mediumRadius
                          bg={theme.colors.softblue}
                          px={3}
                          py={2}
                        >
                <Heading medium>Edit user <strong>{user.userName}</strong></Heading>
                </Flex>
                <div>
                    <Form
                    onSubmit={() => {}}
                    render={() => 
                        <>
                            {isModuleSupported(MODULE.MAP) && <FocusSection />}
                            <Flex flexDirection={'column'} mb={3}>
                                <Label htmlFor="newEmail">Update email address :</Label>
                                <Field
                                    name="newEmail"
                                    component={InputField}
                                    placeholder="New email address"
                                    initialValue={userEmail}
                                    type="email"
                                    autocomplete="off"
                                    required
                                />
                            </Flex>
                        </>
                    }/>
                </div>

                <div>
                  {userEmail}
                </div>

                <Button>Update profile</Button>
            </Box>
          </Flex>
      <Button variant="tertiary">Delete user</Button>
    </>
  )
}
