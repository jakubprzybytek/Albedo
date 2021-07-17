import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import format from 'date-fns/format';

export default function useJsonConnection(responseHandler) {

  const [loading, setLoading] = useState(false);
  const [lastCall, setLastCall] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [duration, setDuration] = useState(0);

  const [autoSubmit, setAutoSubmit] = useState(0);

  const observerLocation = useSelector(state => state.observerLocation);
  const timeZone = useSelector(state => state.timeZone);
  const engineSettings = useSelector(state => state.engineSettings);

  var buildRequestUrl;

  function submit() {
    setLoading(true);
    const startTime = new Date();
    const requestUrl = buildRequestUrl();

    axios.get(requestUrl.url, {
        params: {
          ...requestUrl.params,
          ...observerLocation,
          timeZone: timeZone,
          ...engineSettings
        }
      })
      .then(res => {
        setDuration(new Date() - startTime);
        setLastCall(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        setLinkUrl(res.request.responseURL);
        setErrorMessage('');

        responseHandler(res.data);

        setLoading(false);
      },
      error => {
        setLinkUrl(error.request.responseURL);
        setErrorMessage(error.message);
        setLoading(false);
      });
  }

  function performAutoSubmitIfNeeded() {
    if (autoSubmit == true) {
      setAutoSubmit(false);
      submit();
    }
  }

  return {
    loading: loading,
    lastCall: lastCall,
    errorMessage: errorMessage,
    linkUrl: linkUrl,
    duration: duration,
    registerRequestUriBuilder: (builder) => buildRequestUrl = builder,
    requestAutoSubmit: () => setAutoSubmit(true),
    performAutoSubmitIfNeeded: performAutoSubmitIfNeeded,
    submit: submit,
  }
}
