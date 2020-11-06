function handleSubmit() {
    setLoading(true);
    var startTime = new Date();

    axios.get(url, {
        params: {...buildProps(), ...observerLocation, timeZone: timeZone }
      })
      .then(res => {
        setDuration(new Date() - startTime);
        setLastCall(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        setLinkUrl(res.request.responseURL);
        setErrorMessage('');

        submitResponse(res.data);

        setLoading(false);
      },
      error => {
        setLinkUrl(error.request.responseURL);
        setErrorMessage(error.message);
        setLoading(false);
      });
  }