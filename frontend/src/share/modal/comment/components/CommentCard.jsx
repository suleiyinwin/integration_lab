import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import Axios from '../../../AxiosInstance';
import GlobalContext from '../../../Context/GlobalContext';

const CommentCard = ({ comment = { id: -1, msg: '' }, removeComment, updateComment }) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.msg);
  const [id, setId] = useState(comment.id);
  const {setStatus} = useContext(GlobalContext);

  const submit = useCallback(() => {
    const userToken = Cookies.get('UserToken');
    if (userToken !== undefined && userToken !== 'undefined') {
      if (functionMode === 'update') {
        Axios
          .patch('/comment', {
            text: msg,
            commentId: id,
          }, {headers: {Authorization: `Bearer ${userToken}`}})
          .then(res => {
            if (res.status === 200) {
              setStatus({
                msg: res.data.data.text,
                severity: 'info',
              });
              updateComment(id, msg);
            }
          });
      } else if (functionMode === 'delete') {
        Axios
          .delete('/comment', {headers: { Authorization: `Bearer ${userToken}`}, data: {commentId: id}})
          .then(res => {
            if (res.status === 200) {
              removeComment(id);
            }
          });
      } else {
        // TODO setStatus (snackbar) to error
        setStatus({
          msg: `Error! Function Mode ${functionMode} is not recognized!`,
          severity: 'error',
        });
      }
      setIsConfirm(false);
    }
  }, [functionMode, msg]);

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{comment.msg}</Typography>
      ) : (
        <TextField sx={{ flex: 1 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;